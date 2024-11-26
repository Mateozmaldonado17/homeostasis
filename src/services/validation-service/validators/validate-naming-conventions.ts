import { ErrorTypeEnum } from "../../../enums";
import { IDescriptor, IError, INode } from "../../../models";
import { ConventionList } from "../../../models/IDescriptor";
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
  const errors: IError[] = [];
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
          const errorMessage = getErrorFormated({
            errorType: ErrorTypeEnum.SUCCESS,
            message: `${conventionFormat}, we couln't apply this format to this file: ${content.fullDestination} (${content.name})`,
          });
          console.warn(errorMessage);
          return;
      }

      if (!isValid) {
        const error: IError = {
          errorMessage: `The ${isDirectoryOrFile} in "${
            content.fullDestination
          }" (${
            content.name
          }) is not ${conventionFormat.toLowerCase()}, should be (${suggestedName})`,
          fullpath: content.fullDestination,
          name: content.name,
        };
        errors.push(error);
      }
    });
  });
  return {
    errors,
  };
};

export default validateNamingConventions;
