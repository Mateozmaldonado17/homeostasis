import { INode } from "../../../models";
import {
  IProcessFileTypeProps,
  IProcessNodesCallback,
} from "../models/ValidationTypes";

const processNodes = (
  props: IProcessFileTypeProps,
  callback: (props: IProcessNodesCallback) => void
): void => {
  const { contents, contentSetting, currentType } = props;
  
  const ignoredFiles: string[] = contentSetting?.files.ignore;
  const ignoredDirectories = contentSetting?.directories.ignore;

  const staticContent = contentSetting?.[currentType].content;
  const isStrictContent = contentSetting?.[currentType].strict_content;
  const fileNames = staticContent?.map((typeFile) => typeFile.name);

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
    };

    callback(callbackProps);
  });
};

export default processNodes;
