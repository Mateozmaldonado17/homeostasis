import { SystemLogTypeEnum } from "../../../enums";
import { INode } from "../../../models";
import IResponse from "../../../models/IResponse";
import { extractDirectoryStructure } from "../../file-system-service";
import {
  DefaultBaseToRun,
  IProcessFileCallback,
} from "../models/ValidationTypes";
import { processFileTypes } from "../processors";

const validateRequiredContent = async (
  dest: string
) => {
  const { contentSettings, contents } = await extractDirectoryStructure(dest);
  const responses: IResponse[] = [];

  const configRunningBase = {
    fileType: DefaultBaseToRun,
    contentSettings,
    contents,
  };

  const processFileTypesCallback = (returnProps: IProcessFileCallback) => {
    const {
      isDirectoryOrFile,
      filteredMappedContent,
      ignoredFiles,
      descriptorContent,
      executeHook
    } = returnProps;

    descriptorContent?.forEach((content) => {
      if (ignoredFiles?.includes(content)) return;

      const includeContentInMappedContent = filteredMappedContent.find(
        (node: INode) => node?.name === content
      );

      if (!includeContentInMappedContent) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${content}" located at "${dest}" is essential for the source.`,
          logType: SystemLogTypeEnum.ERROR,
          fullpath: dest,
          name: content,
        };
        responses.push(response);
        executeHook("onStrictContentValidation", returnProps);
      }
    });
  };
  processFileTypes(configRunningBase, processFileTypesCallback);

  return {
    responses,
  };
};

export default validateRequiredContent;
