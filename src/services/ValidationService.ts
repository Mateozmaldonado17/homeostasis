import { IContent, IDescriptor, INode } from "../models";
import { ConventionList } from "../models/IDescriptor";
import IError from "../models/IError";
import { isCamelCase, toCamelCase } from "../utils/CamelCase";
import extractFileFormat from "../utils/ExtractFileFormat";
import { isKebabCase, toKebabCase } from "../utils/KebabCase";
import { isPascalCase, toPascalCase } from "../utils/PascalCase";
import { isSnakeCase, toSnakeCase } from "../utils/SnakeCase";
import { descriptorFile } from "./DescriptorService";

const contentValidation = (
  contents: INode[],
  contentSetting: IDescriptor,
  root: string
) => {
  const errors: IError[] = [];
  ["files", "directories"].forEach((type) => {
    const isDirectoryOrFile = type === "directories" ? "directory" : "file";
    const ignoredFiles = contentSetting?.[type].ignore;
    const descriptorContent = contentSetting?.[type].content?.map((content) => {
      return content.name;
    });
    const mappedContent = contents.map((content: INode) => {
      if (ignoredFiles?.includes(content.name)) return;
      const isFile = type === "files" && !content.isDirectory;
      const isDirectory = type === "directories" && content.isDirectory;
      if (isDirectory || isFile) return content;
    });
    const filteredMappedContent = mappedContent.filter(
      (value) => value !== undefined
    );

    descriptorContent?.forEach((content) => {
      if (ignoredFiles?.includes(content)) return;
      const includeContentInMappedContent = filteredMappedContent.some(
        (node) => node.name === content
      );
      if (!includeContentInMappedContent) {
        const error: IError = {
          errorMessage: `The ${isDirectoryOrFile} in "${root}" (${content}) is essential in the source.`,
          fullpath: root,
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

const conventionValidation = (
  contents: INode[],
  contentSetting: IDescriptor
) => {
  const errors: IError[] = [];
  ["files", "directories"].forEach((type) => {
    const isDirectoryOrFile = type === "directories" ? "directory" : "file";
    const ignoredFiles = contentSetting?.[type].ignore;
    const conventionFormat = contentSetting?.[type].convention;
    const mappedContent = contents.map((content: INode) => {
      if (ignoredFiles?.includes(content.name)) return;
      const isFile = type === "files" && !content.isDirectory;
      const isDirectory = type === "directories" && content.isDirectory;
      if (isDirectory || isFile) return content;
    });
    const filteredMappedContent = mappedContent.filter(
      (value) => value !== undefined
    );

    filteredMappedContent.forEach((content) => {
      if (content.name === descriptorFile) return false;
      if (conventionFormat === ConventionList.CamelCase) {
        if (!isCamelCase(content.name)) {
          const error: IError = {
            errorMessage: `The ${isDirectoryOrFile} in "${
              content.fullDestination
            }" (${content.name}) is not camel-case, should be (${toCamelCase(
              content.name
            )})`,
            fullpath: content.fullDestination,
            name: content.name,
          };
          errors.push(error);
        }
      }
      if (conventionFormat === ConventionList.PascalCase) {
        if (!isPascalCase(content.name)) {
          const error: IError = {
            errorMessage: `The ${isDirectoryOrFile} in "${
              content.fullDestination
            }" (${content.name}) is not pascal-case, should be (${toPascalCase(
              content.name
            )})`,
            fullpath: content.fullDestination,
            name: content.name,
          };
          errors.push(error);
        }
      }
      if (conventionFormat === ConventionList.SnakeCase) {
        if (!isSnakeCase(content.name)) {
          const error: IError = {
            errorMessage: `The ${isDirectoryOrFile} in "${
              content.fullDestination
            }" (${content.name}) is not snake-case, should be (${toSnakeCase(
              content.name
            )})`,
            fullpath: content.fullDestination,
            name: content.name,
          };
          errors.push(error);
        }
      }
      if (conventionFormat === ConventionList.KebabCase) {
        if (!isKebabCase(content.name)) {
          const error: IError = {
            errorMessage: `The ${isDirectoryOrFile} in "${
              content.fullDestination
            }" (${content.name}) is not kebab-case, should be (${toKebabCase(
              content.name
            )})`,
            fullpath: content.fullDestination,
            name: content.name,
          };
          errors.push(error);
        }
      }
    });
  });
  return {
    errors,
  };
};

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

export {
  contentValidation,
  conventionValidation,
  formatValidation,
};
