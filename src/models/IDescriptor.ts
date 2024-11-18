import IContent from "./IContent";

export enum ConventionList {
  CamelCase = "camel-case",
  PascalCase = "pascal-case",
  SnakeCase = "snake-case",
  KebabCase = "kebab-case",
}

export interface IDescriptorItem {
  convention: ConventionList;
  strict_content: boolean;
  ignore: string[],
  allowedFormats: string[],
  content: IContent[];
}

interface IDescriptor {
  directories: Omit<IDescriptorItem, "allowedFormats">,
  files: IDescriptorItem,
  [key: string]: Partial<IDescriptorItem>,
}

export default IDescriptor;
