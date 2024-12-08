import * as fs from "fs";
import { SystemLogTypeEnum } from "../../../enums";
import { IDescriptor, INode } from "../../../models";
import IResponse from "../../../models/IResponse";
import { extractFileFormat } from "../../../utils/file";
import { descriptorFile } from "../../descriptor-service/descriptor-service";
import { FileTypeArray, IProcessFileCallback } from "../models/ValidationTypes";
import { processFileTypes } from "../processors";
import { extractDirectoryStructure } from "../../file-system-service";

const checkFileFormatCompliance = async (
  dest: string
) => {
  const { contentSettings, contents } = await extractDirectoryStructure(dest);
  const responses: IResponse[] = [];

  const configRunningBase = {
    fileType: ["files"] as FileTypeArray,
    contentSettings,
    contents,
  };

  processFileTypes(configRunningBase, (returnProps: IProcessFileCallback) => {
    const { filteredMappedContent, formatFiles, removeIfFormatIsInvalid } = returnProps;

    filteredMappedContent.forEach((content) => {
      if (content.name === descriptorFile) return false;
      const getFileFormat = extractFileFormat(content.name);
      const fileHasInvalidFormat = !formatFiles.includes(getFileFormat);

      if (fileHasInvalidFormat && removeIfFormatIsInvalid) {
        fs.unlinkSync(content.fullDestination);
        const response: IResponse = {
          message: `The file "${content.name}" located in "${
            content.fullDestination
          }" has an unsupported format (${getFileFormat}), this file has been removed.`,
          logType: SystemLogTypeEnum.SUCCESS,
          fullpath: content.fullDestination,
          name: content.name,
        };
        responses.push(response);
      }

      if (fileHasInvalidFormat && !removeIfFormatIsInvalid) {
        const response: IResponse = {
          message: `The file "${content.name}" located in "${
            content.fullDestination
          }" has an unsupported format (${getFileFormat}). Allowed formats for this folder are: ${formatFiles.join(
            ", "
          )}.`,
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

export default checkFileFormatCompliance;
