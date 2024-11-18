import * as fs from "fs";
import { IContent, IDescriptor, INode } from "./models";
import {
  descriptorFile,
  existsInDirectory,
} from "./services/DescriptorService";
import { readDirectory } from "./services/FileSystemService";
import { traverseNodes } from "./services/NodeService";
import * as Logger from "./utils/Logger";

type INodeCompact = Pick<INode, "content" | "contentSettings">;
interface IError {
  fullpath: string;
  name: string;
  errorMessage: string;
}

const errors: IError[] = [];

const strictContentValidation = (
  descriptor: IDescriptor,
  content: INode
) => {
  ["files", "directories"].forEach((type) => {
    if (type === "files" && content.isDirectory) return false;
    if (type === "directories" && !content.isDirectory) return false;
    const isDirectoryOrFile = type === "directories" ? "directory" : "file";
    const staticContent = descriptor?.[type].content;
    const isStrictContent = descriptor?.[type].strict_content;
    const fileNames = staticContent.map(
      (typeFile) => typeFile.name
    );
    if (!fileNames.includes(content.name) && isStrictContent) {
      const error: IError = {
        errorMessage: `The ${isDirectoryOrFile} "${content.name}" is not allowed based on the strict content mode. This file is not listed in the contents of ${descriptorFile}`,
        fullpath: content.fullDestination,
        name: content.name,
      };
      errors.push(error);
    }
  })
};

const contentValidation = (contents: INode[], contentSetting: IDescriptor) => {
  ["files", "directories"].forEach((type) => {
    const isDirectoryOrFile = type === "directories" ? "directory" : "file";
    const descriptorContent = contentSetting?.[type].content.map((content) => {
      return content.name;
    })
    const mappedContent = contents.map((content: INode) => {
      const isDirectory = type === "files" && !content.isDirectory;
      const isFile = type === "directories" && content.isDirectory;
      if (isDirectory || isFile) {
        return content;
      }
    });
    const filteredMappedContent = mappedContent.filter(value => value !== undefined);
    
    descriptorContent.forEach((content) => {
      const includeContentInMappedContent = filteredMappedContent.some(node => node.name === content);
      if (!includeContentInMappedContent) {
        const error: IError = {
          errorMessage: `The ${isDirectoryOrFile} "${content}" is essential in the path ... This file is listed in the contents of ${descriptorFile}`,
          fullpath: "test",
          name: content,
        };
        errors.push(error);
      }
    })
  })
  
}

const runValidations = async (mainNode: INodeCompact): Promise<void> => {
  const contents = mainNode.content as INode[];
  const contentSetting = mainNode.contentSettings;
  for (const content of contents) {
    strictContentValidation(contentSetting as IDescriptor, content);
  }
  contentValidation(contents, contentSetting as IDescriptor)
};

async function main(dest: string): Promise<void> {
  try {
    if ((await existsInDirectory(dest)) === false) {
      throw new Error(
        "We couldn't find the main descriptor file in this project"
      );
    }
    const rootNode: INode[] = await readDirectory(dest);
    await traverseNodes(rootNode);

    const rawData = fs.readFileSync(`${dest}/${descriptorFile}`, "utf8");
    const data: IDescriptor = JSON.parse(rawData);

    const rootNodeRefactored: INodeCompact = {
      content: rootNode,
      contentSettings: data,
    };

    await runValidations(rootNodeRefactored);

    if (errors.length) throw new Error(`[Homeostasis] ⚠ ${errors.length} errors found`);
    if (!errors.length) console.log("✅ errors not found")
  } catch (error: any) {
    console.log(error.message);
    errors.map((error: IError) => {
      Logger.error(error.errorMessage);
    })
  }
}

const params = process.argv.slice(2);
main(params[0]);
