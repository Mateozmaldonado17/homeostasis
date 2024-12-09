import { IContent, IDescriptor, INode } from "../../../models";
import { ConventionList } from "../../../models/IDescriptor";

type FileTypeArray = ("files" | "directories")[];

const DefaultBaseToRun: FileTypeArray = ["files", "directories"];

interface IBase {
  fileType: FileTypeArray;
  contentSettings: IDescriptor
  contents: INode[];
}

interface IProcessFileCallback {
  currentType: string;
  isDirectoryOrFile: string;
  filteredMappedContent: INode[];
  descriptorContent?: string[];
  ignoredFiles?: string[];
  conventionFormat?: ConventionList | string
  formatFiles: string[],
  removeIfFormatIsInvalid: boolean
  executeHook: (hookName: string, ...args: any) => void
}

interface IProcessFileTypeProps {
  contents: INode[];
  contentSettings: IDescriptor;
  currentType: string;
}

interface IProcessNodesCallback {
  content: INode;
  ignoredFiles: string[];
  staticContent?: IContent[];
  isStrictContent?: boolean;
  fileNames?: string[];
  purgeOnStrict?: boolean;
}

export {
  FileTypeArray,
  IBase,
  IProcessFileCallback,
  IProcessFileTypeProps,
  IProcessNodesCallback,
  DefaultBaseToRun,
};