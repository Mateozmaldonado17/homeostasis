import IContent from "./IContent";

export enum ConventionList {
  CamelCase = "camel-case",
  PascalCase = "pascal-case",
  SnakeCase = "snake-case",
  KebabCase = "kebab-case",
}

export interface IDescriptorItem {
  removeIfFormatIsInvalid: boolean;
  convention: ConventionList | string;
  strict_content: boolean;
  ignore: string[],
  allowedFormats: string[],
  content: IContent[];
  autoFormatting: boolean;
  purgeOnStrict: boolean;
}

interface IDescriptor {
  directories: Omit<IDescriptorItem, "allowedFormats">,
  files: IDescriptorItem,
  [key: string]: Partial<IDescriptorItem>,
}

export default IDescriptor;
