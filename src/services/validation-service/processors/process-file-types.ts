import { IContent, INode } from "../../../models";
import { IBase, IProcessFileCallback } from "../models/ValidationTypes";

const isNotIterable = (obj: any): boolean => {
  return obj == null || typeof obj[Symbol.iterator] !== "function";
}

const processFileTypes = (
  props: IBase,
  callback: (returnProps: IProcessFileCallback) => void
): void => {
  const { fileType, contentSettings, contents } = props;
  const formatFiles = contentSettings.files.allowedFormats || [];
  const removeIfFormatIsInvalid = contentSettings.files.removeIfFormatIsInvalid;
  const plugins = contentSettings.plugins;

  const executeHook = (hookName: string, ...args: string[]) => {
    if (isNotIterable(plugins)) return false;
    for (const plugin of plugins) {
      console.log(`${plugin.name}: ${hookName}`);
      if (typeof plugin[hookName] !== "function") return false;
      plugin[hookName](...args);
    }
  }

  fileType.forEach((currentType: string) => {
    const conventionFormat = contentSettings?.[currentType].convention as string;
    const ignoredFiles = contentSettings?.[currentType].ignore;

    const descriptorContent: string[] | undefined = contentSettings?.[
      currentType
    ].content?.map((content: IContent) => content.name);

    const isDirectoryOrFile =
      currentType === "directories" ? "directory" : "file";
    
    const mappedContent = contents.map((content: INode) => {
      if (ignoredFiles?.includes(content.name)) {
        executeHook("onIgnore", content.name);
        return;
      }
      const isFile = currentType === "files" && !content.isDirectory;
      const isDirectory = currentType === "directories" && content.isDirectory;
      if (isDirectory || isFile) return content;
    });

    const filteredMappedContent = mappedContent.filter(
      (value) => value !== undefined
    );
    
    callback({
      ignoredFiles,
      currentType,
      isDirectoryOrFile,
      filteredMappedContent,
      descriptorContent,
      conventionFormat,
      formatFiles,
      removeIfFormatIsInvalid,
      executeHook
    });
  });
};

export default processFileTypes;
