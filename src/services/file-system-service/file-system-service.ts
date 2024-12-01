import * as fs from "fs";
import { createNode } from "../node-service/node-service";
import { INode } from "../../models";


const getStats = async (path: string) => {
  return fs.promises.stat(path);
};

const readDirectory = async (directory: string): Promise<INode[]> => {
  const files = await fs.promises.readdir(directory);
  const nodes = await Promise.all(
    files.map((file) => createNode(file, directory))
  );
  return nodes.filter((node): node is INode => node !== null);
};

export { getStats, readDirectory };
