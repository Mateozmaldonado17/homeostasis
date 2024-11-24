import { IDescriptor, IError, INode } from "../../../models";
import {
  DefaultBaseToRun,
  IProcessFileCallback,
} from "../models/ValidationTypes";
import { processFileTypes } from "../processors";

const validateRequiredContent = (
  contents: INode[],
  contentSetting: IDescriptor,
  root: string
) => {
  const errors: IError[] = [];
  const configRunningBase = {
    fileType: DefaultBaseToRun,
    contentSetting,
    contents,
  };
  const processFileTypesCallback = (returnProps: IProcessFileCallback) => {
    const {
      isDirectoryOrFile,
      filteredMappedContent,
      ignoredFiles,
      descriptorContent,
    } = returnProps;
    descriptorContent?.forEach((content) => {
      if (ignoredFiles?.includes(content)) return;

      const includeContentInMappedContent = filteredMappedContent.find(
        (node: INode) => node?.name === content
      );

      if (!includeContentInMappedContent) {
        const error: IError = {
          errorMessage: `The ${isDirectoryOrFile} in "${root}" (${content}) is essential in the source.`,
          fullpath: root,
          name: content,
        };
        errors.push(error);
      }
    });
  };
  processFileTypes(configRunningBase, processFileTypesCallback);

  return {
    errors,
  };
};

export default validateRequiredContent;
