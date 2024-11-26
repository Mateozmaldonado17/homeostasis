import * as fs from "fs";
import { IDescriptor, INode } from "../models/";
import { descriptorFile, existsInDirectory } from "./DescriptorService";
import { getStats, readDirectory } from "./FileSystemService";
import * as Logger from "../utils/logger/Logger";

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
      const rawData = fs.readFileSync(`${fullPath}/${descriptorFile}`, 'utf8');
      const descriptorData: IDescriptor = JSON.parse(rawData);     
      nodeComplete.contentSettings = descriptorData as IDescriptor;
    }

    return nodeComplete;

  } catch (error: any) {
    Logger.sendLog(error.message)
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
