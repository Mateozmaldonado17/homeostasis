import { SystemLogTypeEnum } from "../../../enums";
import { IDescriptor, INode } from "../../../models";
import { ConventionList } from "../../../models/IDescriptor";
import IResponse from "../../../models/IResponse";
import { isCamelCase, toCamelCase } from "../../../utils/CamelCase";
import { isKebabCase, toKebabCase } from "../../../utils/KebabCase";
import { getErrorFormated } from "../../../utils/logger/Logger";
import { isPascalCase, toPascalCase } from "../../../utils/PascalCase";
import { isSnakeCase, toSnakeCase } from "../../../utils/SnakeCase";
import { descriptorFile } from "../../DescriptorService";
import {
  DefaultBaseToRun,
  IProcessFileCallback,
} from "../models/ValidationTypes";
import { processFileTypes } from "../processors";

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
    const { isDirectoryOrFile, filteredMappedContent, conventionFormat } =
      returnProps;

    filteredMappedContent.forEach((content) => {
      if (content.name === descriptorFile) return false;

      let isValid = true;
      let suggestedName = "";

      switch (conventionFormat) {
        case ConventionList.CamelCase:
          isValid = isCamelCase(content.name);
          suggestedName = toCamelCase(content.name);
          break;
        case ConventionList.PascalCase:
          isValid = isPascalCase(content.name);
          suggestedName = toPascalCase(content.name);
          break;
        case ConventionList.SnakeCase:
          isValid = isSnakeCase(content.name);
          suggestedName = toSnakeCase(content.name);
          break;
        case ConventionList.KebabCase:
          isValid = isKebabCase(content.name);
          suggestedName = toKebabCase(content.name);
          break;
        default:
          const response: IResponse = {
            message: `The convention "${conventionFormat}" could not be applied to the file "${content.name}" located at "${content.fullDestination}".`,
            logType: SystemLogTypeEnum.FATAL,
            fullpath: content.fullDestination,
            name: content.name,
          };
          responses.push(response);
          return;
      }

      if (!isValid) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${content.name}" located at "${
            content.fullDestination
          }" does not follow the ${conventionFormat.toLowerCase()} convention. It should be renamed to "${suggestedName}".`,
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
