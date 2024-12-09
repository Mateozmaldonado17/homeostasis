import * as fs from "fs";
import { SystemLogTypeEnum } from "../../../enums";
import IResponse from "../../../models/IResponse";
import {
  DefaultBaseToRun,
  IProcessFileCallback,
  IProcessFileTypeProps,
  IProcessNodesCallback,
} from "../models/ValidationTypes";
import { processFileTypes, processNodes } from "../processors";
import { extractDirectoryStructure } from "../../file-system-service";

const strictContentValidator = async (
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
    const { isDirectoryOrFile, currentType, executeHook } = returnProps;

    const processNodesProps: IProcessFileTypeProps = {
      contents,
      contentSettings,
      currentType,
    };

    const processNodesCallback = (filesProps: IProcessNodesCallback) => {
      const { content, fileNames, isStrictContent, purgeOnStrict } = filesProps;
      const fileIsNotExistAndIsStricContentMode =
        !fileNames?.includes(content.name) && isStrictContent;
      const fullpath = content.fullDestination;
      
      if (fileIsNotExistAndIsStricContentMode && purgeOnStrict) {
        if (isDirectoryOrFile === "directory") {
          fs.rmSync(fullpath, { recursive: true, force: true });
        }

        if (isDirectoryOrFile === "file") {
          fs.unlinkSync(fullpath);
        }

        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${content.name}" located at "${fullpath}" is not permitted under the strict content mode and was deleted.`,
          logType: SystemLogTypeEnum.SUCCESS,
          fullpath: fullpath,
          name: content.name,
        };
        responses.push(response);
        executeHook("onPurgeOnStrict", filesProps);
      }

      if (fileIsNotExistAndIsStricContentMode && !purgeOnStrict) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${content.name}" located at "${content.fullDestination}" is not permitted under the strict content mode.`,
          logType: SystemLogTypeEnum.ERROR,
          fullpath: content.fullDestination,
          name: content.name,
        };
        responses.push(response);
        executeHook("onStrictContentValidation", filesProps);
      }

    };
    processNodes(processNodesProps, processNodesCallback);
  };

  processFileTypes(configRunningBase, processFileTypesCallback);

  return {
    responses,
  };
};

export default strictContentValidator;
