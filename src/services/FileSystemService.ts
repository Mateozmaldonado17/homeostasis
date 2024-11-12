import * as fs from "fs";
import { INode } from "../models";
import { createNode } from "./NodeService";

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
