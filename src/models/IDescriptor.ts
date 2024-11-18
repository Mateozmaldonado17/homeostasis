import IContent from "./IContent";

export enum ConventionList {
  CamelCase = "camel-case",
  PascalCase = "pascal-case",
  SnakeCase = "SnakeCase",
  KebabCase = "KebabCase",
}

export interface IDescriptorItem {
  convention: ConventionList;
  strict_content: boolean;
  content: IContent[];
}

interface IDescriptor {

  directories: IDescriptorItem,
  files: IDescriptorItem
  [key: string]: IDescriptorItem,
}

export default IDescriptor;
