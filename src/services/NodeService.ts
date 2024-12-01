import { IDescriptor, INode } from "../models/";
import { descriptorFile, existsInDirectory, loadJSModule } from "./descriptor-service/descriptor-service";
import { getStats, readDirectory } from "./FileSystemService";
import { sendLog } from "../utils/logger";

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

    const nodeComplete = {
      name: fileName,
      fullDestination: fullPath,
      isDirectory: isDirectory,
      isIterable: isIterable,
      content: null,
      isVisited: false,
      contentSettings: {} as IDescriptor
    };   

    if (isDirectory && isIterable) {   
      const descriptorData = await loadJSModule<IDescriptor>(`${fullPath}/${descriptorFile}`);
      nodeComplete.contentSettings = descriptorData as IDescriptor;
    }

    return nodeComplete;

  } catch (error: any) {
    sendLog(error.message)
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
