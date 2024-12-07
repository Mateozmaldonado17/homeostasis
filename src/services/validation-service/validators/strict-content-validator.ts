import * as fs from "fs";
import { SystemLogTypeEnum } from "../../../enums";
import { IDescriptor, INode } from "../../../models";
import IResponse from "../../../models/IResponse";
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
  const responses: IResponse[] = [];
  const configRunningBase = {
    fileType: DefaultBaseToRun,
    contentSetting,
    contents,
  };
  const processFileTypesCallback = (returnProps: IProcessFileCallback) => {
    const { isDirectoryOrFile, currentType } = returnProps;
    const processNodesProps: IProcessFileTypeProps = {
      contents,
      contentSetting,
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
      }

      if (fileIsNotExistAndIsStricContentMode && !purgeOnStrict) {
        const response: IResponse = {
          message: `The ${isDirectoryOrFile} "${content.name}" located at "${content.fullDestination}" is not permitted under the strict content mode.`,
          logType: SystemLogTypeEnum.ERROR,
          fullpath: content.fullDestination,
          name: content.name,
        };
        responses.push(response);
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
