import { IContent, INode } from "../../../models";
import { IBase, IProcessFileCallback } from "../models/ValidationTypes";

const processFileTypes = (
  props: IBase,
  callback: (returnProps: IProcessFileCallback) => void
): void => {
  const { fileType, contentSettings, contents } = props;
  const formatFiles = contentSettings.files.allowedFormats || [];
  const removeIfFormatIsInvalid = contentSettings.files.removeIfFormatIsInvalid;
  const plugins = contentSettings.plugins;

  const executeHook = (hookName: string, ...args: string[]) => {
    const isNotIterable =
      plugins == null || typeof plugins[Symbol.iterator] !== "function";
    if (isNotIterable) return false;
    for (const plugin of plugins) {
      console.log(`${plugin.name}: ${hookName}`);
      if (typeof plugin[hookName] === "function") {
        plugin[hookName](...args);
      } else {
        console.warn(
          `Hook "${hookName}" is not defined in plugins "${plugin.name}".`
        );
      }
    }
  };

  fileType.forEach((currentType: string) => {
    const conventionFormat = contentSettings?.[currentType]
      .convention as string;
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
      executeHook,
    });
  });
};

export default processFileTypes;
