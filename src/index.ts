import * as fs from "fs";
import { IDescriptor, INode } from "./models";
import {
  descriptorFile,
  existsInDirectory,
} from "./services/DescriptorService";
import { readDirectory } from "./services/FileSystemService";
import { traverseNodes } from "./services/NodeService";
import * as Logger from "./utils/Logger";
import IError from "./models/IError";
import { contentValidation, strictContentValidation } from "./services/ValidationService";

const globalErrors: IError[] = [];

const runValidations = async (mainNode: Partial<INode>): Promise<void> => {
  const contents = mainNode.content as INode[];
  const contentSetting = mainNode.contentSettings;
  for (const content of contents) {
    const strictContentResult = strictContentValidation(contentSetting as IDescriptor, content);
    if (strictContentResult.errors.length) globalErrors.push(...strictContentResult.errors);
    if (content.isIterable) {
      runValidations(content as Partial<INode>)
    }
  }
  const contentValidationResult = contentValidation(contents, contentSetting as IDescriptor)
  if (contentValidationResult.errors.length) globalErrors.push(...contentValidationResult.errors);
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

    const rootNodeRefactored: Partial<INode> = {
      content: rootNode,
      contentSettings: data,
    };
    await runValidations(rootNodeRefactored);

    console.log("[Homeostasis]")
    if (globalErrors.length) throw new Error(`⚠ ${globalErrors.length} errors found`);
    if (!globalErrors.length) console.log("✅ errors not found")
  } catch (error: any) {
    console.log(error.message);
    globalErrors.map((error: IError) => {
      Logger.error(error.errorMessage);
    })
  }
}

const params = process.argv.slice(2);
main(params[0]);
