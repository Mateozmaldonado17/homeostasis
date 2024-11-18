import { IDescriptor, INode } from "../models";
import IError from "../models/IError";
import { descriptorFile } from "./DescriptorService";

const strictContentValidation = (descriptor: IDescriptor, content: INode) => {
  const errors: IError[] = [];
  ["files", "directories"].forEach((type) => {
    if (type === "files" && content.isDirectory) return false;
    if (type === "directories" && !content.isDirectory) return false;
    const isDirectoryOrFile = type === "directories" ? "directory" : "file";
    const staticContent = descriptor?.[type].content;
    const isStrictContent = descriptor?.[type].strict_content;
    const fileNames = staticContent.map((typeFile) => typeFile.name);
    if (!fileNames.includes(content.name) && isStrictContent) {
      const error: IError = {
        errorMessage: `The ${isDirectoryOrFile} in "${content.fullDestination}" (${content.name}) is not allowed based on the strict content mode.`,
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

const contentValidation = (contents: INode[], contentSetting: IDescriptor, root: string) => {
  const errors: IError[] = [];
  ["files", "directories"].forEach((type) => {
    const isDirectoryOrFile = type === "directories" ? "directory" : "file";
    const descriptorContent = contentSetting?.[type].content.map((content) => {
      return content.name;
    });
    const mappedContent = contents.map((content: INode) => {
      const isDirectory = type === "files" && !content.isDirectory;
      const isFile = type === "directories" && content.isDirectory;
      if (isDirectory || isFile) {
        return content;
      }
    });
    const filteredMappedContent = mappedContent.filter(
      (value) => value !== undefined
    );

      descriptorContent.forEach((content) => {
      const includeContentInMappedContent = filteredMappedContent.some(
        (node) => node.name === content
      );
      if (!includeContentInMappedContent) {
        const error: IError = {
          errorMessage: `The ${isDirectoryOrFile} "${root}" (${content}) is essential in the path ${content}.`,
          fullpath: "test",
          name: content,
        };
        errors.push(error);
      }
    });
  });
  return {
    errors,
  };
};

export { strictContentValidation, contentValidation };
