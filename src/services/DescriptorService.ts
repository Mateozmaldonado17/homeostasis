import * as fs from "fs";
import * as path from "path";

const descriptorFile = "descriptor.json";

const existsInDirectory = async (directory: string): Promise<boolean> => {
  return fs.existsSync(path.join(directory, descriptorFile));
};

export { descriptorFile, existsInDirectory };
