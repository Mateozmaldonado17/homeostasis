import { IDescriptor, INode } from "../models";
import IError from "../models/IError";
import extractFileFormat from "../utils/ExtractFileFormat";
import { descriptorFile } from "./DescriptorService";

const formatValidation = (contents: INode[], contentSetting: IDescriptor) => {
  const errors: IError[] = [];
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
      const error: IError = {
        errorMessage: `This file in "${content.fullDestination}" (${content.name}) has format ${getFileFormat} and is not allowed in this folder.`,
        fullpath: content.fullDestination,
        name: content.name,
      };
      errors.push(error);
    }
  });
  return {
    errors,
  };
};

export { formatValidation };
