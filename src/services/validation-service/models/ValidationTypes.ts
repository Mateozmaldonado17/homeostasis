import { IContent, IDescriptor, INode } from "../../../models";
import { ConventionList } from "../../../models/IDescriptor";

type FileTypeArray = ("files" | "directories")[];

const DefaultBaseToRun: FileTypeArray = ["files", "directories"];

interface IBase {
  fileType: FileTypeArray;
  contentSetting: IDescriptor
  contents: INode[];
}

interface IProcessFileCallback {
  currentType: string;
  isDirectoryOrFile: string;
  filteredMappedContent: INode[];
  descriptorContent: string[] | undefined;
  ignoredFiles: string[] | undefined;
  conventionFormat: ConventionList | undefined
  formatFiles: string[],
  removeIfFormatIsInvalid: boolean
}

interface IProcessFileTypeProps {
  contents: INode[];
  contentSetting: IDescriptor;
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