import * as fs from "fs";
import * as path from "path";

const descriptorFile = "descriptor.js";

const existsInDirectory = async (directory: string): Promise<boolean> => {
  return fs.existsSync(path.join(directory, descriptorFile));
};

const loadJSModule = async <T>(filePath: string): Promise<T> => {
  const absolutePath = path.resolve(filePath);
  const module = await import(absolutePath);
  return module;
};

export { descriptorFile, existsInDirectory, loadJSModule };
