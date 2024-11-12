import IContent from "./IContent";

enum ConventionList {
  CamelCase = "CamelCase",
  PascalCase = "PascalCase",
  SnakeCase = "SnakeCase",
  KebabCase = "KebabCase",
}

enum WatchList {
  Eager = "Eager",
  Lazy = "Lazy",
}

interface IDescriptor {
  watch: WatchList;
  convention: ConventionList[];
  strict_content: boolean;
  content: IContent[];
}

export default IDescriptor;
