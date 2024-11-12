import { INode } from "../models/";
import { existsInDirectory } from "./DescriptorService";
import { getStats, readDirectory } from "./FileSystemService";
import * as Logger from "../utils/Logger";

const createNode = async (
  fileName: string,
  directory: string
): Promise<INode | null> => {
  try {
    const fullPath = `${directory}/${fileName}`;
    const stats = await getStats(fullPath);
    const isDirectory = stats.isDirectory();
    const isIterable = isDirectory
      ? await existsInDirectory(fullPath)
      : false;

    return {
      name: fileName,
      fullDestination: fullPath,
      isDirectory: isDirectory,
      isIterable: isIterable,
      content: null,
      isVisited: false,
    };    
  } catch (error: any) {
    Logger.error(error.message)
  }
  return null;
};

const traverseNodes = async (nodes: INode[]): Promise<void | boolean> => {
  for (const node of nodes) {
    if (node.isIterable && !node.isVisited) {
      node.isVisited = true;
      node.content = await readDirectory(node.fullDestination);
      if (node.content) {
        await traverseNodes(node.content);
      }
    }
  }
};

export { createNode, traverseNodes };
