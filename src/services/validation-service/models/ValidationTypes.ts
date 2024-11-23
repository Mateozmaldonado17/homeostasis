import { IContent, IDescriptor, INode } from "../../../models";

type FileTypeArray = ("files" | "directories")[];

const DefaultBaseToRun: FileTypeArray = ["files", "directories"];

interface IBase {
  fileType: FileTypeArray;
}

interface IProcessFileCallback {
  currentType: string;
  isDirectoryOrFile: string;
}

interface IProcessFileTypeProps {
  contents: INode[];
  contentSetting: IDescriptor;
  currentType: string;
}

interface IProcessNodesCallback {
  content: INode;
  ignoredFiles: string[];
  staticContent: IContent[] | undefined;
  isStrictContent: boolean | undefined;
  fileNames: string[] | undefined;
}

export {
  FileTypeArray,
  DefaultBaseToRun,
  IBase,
  IProcessFileCallback,
  IProcessFileTypeProps,
  IProcessNodesCallback,
};
