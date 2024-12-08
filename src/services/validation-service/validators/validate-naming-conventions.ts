const fs = require("fs").promises;
const path = require("path");
import { SystemLogTypeEnum } from "../../../enums";
import { ConventionList } from "../../../models/IDescriptor";
import IResponse from "../../../models/IResponse";
import { validateAndSuggestNamingConvention } from "../../../utils/string";
import { descriptorFile } from "../../descriptor-service/descriptor-service";
import { extractDirectoryStructure } from "../../file-system-service";
import {
  DefaultBaseToRun,
  IProcessFileCallback,
} from "../models/ValidationTypes";
import { processFileTypes } from "../processors";

const validateNamingConventions = async (
  dest: string
) => {
  const { contentSettings, contents } = await extractDirectoryStructure(dest);
  const responses: IResponse[] = [];

  const configRunningBase = {
    fileType: DefaultBaseToRun,
    contentSettings,
    contents,
  };

  await processFileTypes(configRunningBase, async (returnProps: IProcessFileCallback) => {
    const {
      isDirectoryOrFile,
      filteredMappedContent,
      conventionFormat,
      currentType,
    } = returnProps;

    const staticContent = contentSettings?.[currentType].content;
    const autoFormatting = contentSettings?.[currentType].autoFormatting;
    const fileNames = staticContent?.map((typeFile) => typeFile.name);

    fileNames?.forEach((fileName: string) => {
      const { isValid, suggestedName } = validateAndSuggestNamingConvention(
        fileName,
        conventionFormat as ConventionList
      );

      if (!isValid) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${fileName}" does not follow the "${(
            conventionFormat as string
          ).toLowerCase()}" naming convention in descriptor file. It should be renamed to "${suggestedName}".`,
          logType: SystemLogTypeEnum.FATAL,
          fullpath: "",
          name: fileName,
        };
        responses.push(response);
      }
    });

    for (const content of filteredMappedContent) {
      const name = content.name;
      if (name === descriptorFile) return false;

      const { isValid, suggestedName } = validateAndSuggestNamingConvention(
        name,
        conventionFormat as ConventionList
      );

      if (!isValid && autoFormatting) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${name}" located at "${content.fullDestination}" has been renamed to "${suggestedName}".`,
          logType: SystemLogTypeEnum.SUCCESS,
          fullpath: content.fullDestination,
          name,
        };
        responses.push(response);

        const dir = path.dirname(content.fullDestination);
        const newPath = path.join(dir, suggestedName);
        await fs.rename(content.fullDestination, newPath);
      }

      if (!isValid && !autoFormatting) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${name}" located at "${
            content.fullDestination
          }" does not follow the ${(
            conventionFormat as string
          ).toLowerCase()} convention. It should be renamed to "${suggestedName}".`,
          logType: SystemLogTypeEnum.ERROR,
          fullpath: content.fullDestination,
          name,
        };
        responses.push(response);
      }
    };
  });
  return {
    responses,
  };
};

export default validateNamingConventions;
