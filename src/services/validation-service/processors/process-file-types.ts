import { INode } from "../../../models";
import { IBase, IProcessFileCallback } from "../models/ValidationTypes";

const processFileTypes = (
  props: IBase,
  callback: (returnProps: IProcessFileCallback) => void
): void => {
  const { fileType, contentSetting, contents } = props;
  const formatFiles = contentSetting.files.allowedFormats || [];
  const removeIfFormatIsInvalid = contentSetting.files.removeIfFormatIsInvalid;

  fileType.forEach((currentType: string) => {
    const conventionFormat = contentSetting?.[currentType].convention;
    const ignoredFiles = contentSetting?.[currentType].ignore;

    const descriptorContent: string[] | undefined = contentSetting?.[
      currentType
    ].content?.map((content) => content.name);

    const isDirectoryOrFile =
      currentType === "directories" ? "directory" : "file";

    const mappedContent = contents.map((content: INode) => {
      if (ignoredFiles?.includes(content.name)) return;
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
      removeIfFormatIsInvalid
    });
  });
};

export default processFileTypes;
