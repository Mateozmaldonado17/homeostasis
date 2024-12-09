import { IContent, INode } from "../../../models";
import {
  IProcessFileTypeProps,
  IProcessNodesCallback,
} from "../models/ValidationTypes";


const processNodes = (
  props: IProcessFileTypeProps,
  callback: (props: IProcessNodesCallback) => void
): void => {
  const { contents, contentSettings, currentType } = props;
  
  const ignoredFiles: string[] = contentSettings?.files.ignore;
  const ignoredDirectories = contentSettings?.directories.ignore;

  const staticContent = contentSettings?.[currentType].content;
  const isStrictContent = contentSettings?.[currentType].strict_content;
  const purgeOnStrict = contentSettings?.[currentType].purgeOnStrict;

  const fileNames = staticContent?.map((typeFile: IContent) => typeFile.name);

  contents.forEach((content: INode) => {
    const thisFileOrDirShouldBeIgnore =
      ignoredDirectories?.includes(content.name) ||
      ignoredFiles?.includes(content.name);

    if (thisFileOrDirShouldBeIgnore) return false;

    if (currentType === "files" && content.isDirectory) return false;
    if (currentType === "directories" && !content.isDirectory) return false;

    const callbackProps: IProcessNodesCallback = {
      content,
      ignoredFiles,
      staticContent,
      isStrictContent,
      fileNames,
      purgeOnStrict
    };

    callback(callbackProps);
  });
};

export default processNodes;
