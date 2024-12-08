import { IDescriptor, INode } from "../../models";
import {
  descriptorFile,
  loadJSModule,
} from "../descriptor-service/descriptor-service";
import { traverseNodes } from "../node-service";
import { readDirectory } from "./file-system-service";

const extractDirectoryStructure = async (
  dest: string
): Promise<{ contents: INode[]; contentSettings: IDescriptor }> => {
  const rootNode: INode[] = await readDirectory(dest);
  await traverseNodes(rootNode);
  const data = await loadJSModule<IDescriptor>(`${dest}/${descriptorFile}`);
  return {
    contents: rootNode,
    contentSettings: data,
  };
};

export default extractDirectoryStructure;
