import IContent from "./IContent";

enum ConventionList {
  CamelCase = "CamelCase",
  PascalCase = "PascalCase",
  SnakeCase = "SnakeCase",
  KebabCase = "KebabCase",
}

export interface IDescriptorItem {
  convention: ConventionList[];
  strict_content: boolean;
  content: IContent[];
}

interface IDescriptor {
  directories: IDescriptorItem,
  files: IDescriptorItem
  [key: string]: IDescriptorItem,
}

export default IDescriptor;
