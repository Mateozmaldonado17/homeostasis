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
    Name: fileName,
    FullDestination: fullPath,
    IsDirectory: isDirectory,
    IsIterable: isIterable,
    Content: null,
    IsVisited: false,
  };
};

const traverseNodes = async (nodes: INode[]): Promise<void> => {
  for (const node of nodes) {
    if (node.IsIterable && !node.IsVisited) {
      node.IsVisited = true;
      node.Content = await readDirectory(node.FullDestination);
      if (node.Content) {
        await traverseNodes(node.Content);
      }
    }
  }
};

export { createNode, traverseNodes };
