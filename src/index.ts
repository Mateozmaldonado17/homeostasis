import { INode } from "./models";
import { existsInDirectory } from "./services/DescriptorService";
import { readDirectory } from "./services/FileSystemService";
import { traverseNodes } from "./services/NodeService";
import * as Logger from "./utils/Logger"

async function main(dest: string): Promise<void> {
  try {
    if (await existsInDirectory(dest) === false) {
      throw new Error("We couldn't find the main descriptor file in this project");
    }

    await readDirectory(dest);

    const rootNode: INode[] = await readDirectory(dest);
    await traverseNodes(rootNode);

    console.log(JSON.stringify(rootNode, null, 2));
  } catch (error: any) {
    Logger.error(error.message);
  }
}

const params = process.argv.slice(2);
main(params[0]);