import { INode } from "../models/";
import { existsInDirectory } from "./DescriptorService";
import { getStats, readDirectory } from "./FileSystemService";

const createNode = async (
  fileName: string,
  directory: string
): Promise<INode> => {
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
};

const traverseNodes = async (nodes: INode[]): Promise<void> => {
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
