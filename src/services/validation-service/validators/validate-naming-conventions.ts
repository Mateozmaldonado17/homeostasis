import { SystemLogTypeEnum } from "../../../enums";
import { IDescriptor, INode } from "../../../models";
import { ConventionList } from "../../../models/IDescriptor";
import IResponse from "../../../models/IResponse";
import {
  isCamelCase,
  isKebabCase,
  isPascalCase,
  isSnakeCase,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
  validateAndSuggestNamingConvention,
} from "../../../utils/string";

import { descriptorFile } from "../../descriptor-service/descriptor-service";
import {
  DefaultBaseToRun,
  IProcessFileCallback,
  IProcessFileTypeProps,
  IProcessNodesCallback,
} from "../models/ValidationTypes";
import { processFileTypes, processNodes } from "../processors";

const validateNamingConventions = (
  contents: INode[],
  contentSetting: IDescriptor
) => {
  const responses: IResponse[] = [];

  const configRunningBase = {
    fileType: DefaultBaseToRun,
    contentSetting,
    contents,
  };

  processFileTypes(configRunningBase, (returnProps: IProcessFileCallback) => {
    const {
      isDirectoryOrFile,
      filteredMappedContent,
      conventionFormat,
      currentType
    } = returnProps;

    const staticContent = contentSetting?.[currentType].content;
    const fileNames = staticContent?.map((typeFile) => typeFile.name);

    fileNames?.forEach((fileName: string) => {
      const { isValid, suggestedName } = validateAndSuggestNamingConvention(
        fileName,
        conventionFormat as ConventionList
      );
  
      if (!isValid) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${fileName}" does not follow the "${(conventionFormat as string).toLowerCase()}" naming convention in descriptor file. It should be renamed to "${suggestedName}".`,
          logType: SystemLogTypeEnum.FATAL,
          fullpath: "",
          name: fileName,
        };
        responses.push(response);
      }
    })

    filteredMappedContent.forEach((content) => {
      const name = content.name;
      if (name === descriptorFile) return false;

      const { isValid, suggestedName } = validateAndSuggestNamingConvention(
        name,
        conventionFormat as ConventionList
      );

      if (!isValid) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${content.name}" located at "${
            content.fullDestination
          }" does not follow the ${(
            conventionFormat as string
          ).toLowerCase()} convention. It should be renamed to "${suggestedName}".`,
          logType: SystemLogTypeEnum.ERROR,
          fullpath: content.fullDestination,
          name: content.name,
        };
        responses.push(response);
      }
    });
  });
  return {
    responses,
  };
};

export default validateNamingConventions;
