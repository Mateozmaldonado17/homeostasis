import { INode } from "../../../models";
import { IBase, IProcessFileCallback } from "../models/ValidationTypes";

const processFileTypes = (
  props: IBase,
  callback: (returnProps: IProcessFileCallback) => void
): void => {
  const { fileType, contentSettings, contents } = props;
  const formatFiles = contentSettings.files.allowedFormats || [];
  const removeIfFormatIsInvalid = contentSettings.files.removeIfFormatIsInvalid;

  fileType.forEach((currentType: string) => {
    const conventionFormat = contentSettings?.[currentType].convention as string;
    const ignoredFiles = contentSettings?.[currentType].ignore;

    const descriptorContent: string[] | undefined = contentSettings?.[
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
