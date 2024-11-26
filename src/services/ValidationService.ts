import { SystemLogTypeEnum } from "../enums";
import { IDescriptor, INode } from "../models";
import IResponse from "../models/IResponse";
import IError from "../models/IResponse";
import extractFileFormat from "../utils/ExtractFileFormat";
import { descriptorFile } from "./DescriptorService";

const formatValidation = (contents: INode[], contentSetting: IDescriptor) => {
  const responses: IError[] = [];
  const ignoredFiles = contentSetting.files.ignore;
  const formatFiles = contentSetting.files.allowedFormats || [];
  const mappedContent = contents.map((content: INode) => {
    if (ignoredFiles?.includes(content.name)) return;
    const isFile = !content.isDirectory;
    if (isFile) return content;
  });

  const filteredMappedContent = mappedContent.filter(
    (value) => value !== undefined
  );
  filteredMappedContent.forEach((content) => {
    if (content.name === descriptorFile) return false;
    const getFileFormat = extractFileFormat(content.name);
    if (!formatFiles.includes(getFileFormat)) {
      const response: IResponse = {
        message: `This file in "${content.fullDestination}" (${content.name}) has format ${getFileFormat} and is not allowed in this folder.`,
        logType: SystemLogTypeEnum.ERROR,
        fullpath: content.fullDestination,
        name: content.name,
      };
      responses.push(response);
    }
  });
  return {
    responses,
  };
};

export { formatValidation };
