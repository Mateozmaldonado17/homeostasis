import { IDescriptor, INode, IError } from "../../../models";
import {
  DefaultBaseToRun,
  IProcessFileCallback,
  IProcessFileTypeProps,
  IProcessNodesCallback,
} from "../models/ValidationTypes";
import { processFileTypes, processNodes } from "../processors";

const strictContentValidator = (
  contentSetting: IDescriptor,
  contents: INode[]
) => {
  const errors: IError[] = [];
  const configRunningBase = { fileType: DefaultBaseToRun, contentSetting, contents };
  const processFileTypesCallback = (returnProps: IProcessFileCallback) => {
    const { isDirectoryOrFile, currentType } = returnProps;
    const processNodesProps: IProcessFileTypeProps = {
      contents,
      contentSetting,
      currentType,
    };
    const processNodesCallback = (filesProps: IProcessNodesCallback) => {
      const { content, fileNames, isStrictContent } = filesProps;
      if (!fileNames?.includes(content.name) && isStrictContent) {
        const error: IError = {
          errorMessage: `The ${isDirectoryOrFile} in "${content.fullDestination}" (${content.name}) is not allowed based on the strict content mode.`,
          fullpath: content.fullDestination,
          name: content.name,
        };
        errors.push(error);
      }
    };
    processNodes(processNodesProps, processNodesCallback);
  };

  processFileTypes(configRunningBase, processFileTypesCallback);

  return {
    errors,
  };
};

export default strictContentValidator;
