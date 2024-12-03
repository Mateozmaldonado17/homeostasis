import { ConventionList } from "../../models/IDescriptor";
import { isCamelCase, toCamelCase } from "./camel-case";
import { isKebabCase, toKebabCase } from "./kebab-case";
import { isPascalCase, toPascalCase } from "./pascal-case";
import { isSnakeCase, toSnakeCase } from "./snake-case";

interface INamingConventionSuggestion {
  isValid: boolean;
  suggestedName: string;
}

export function validateAndSuggestNamingConvention(
  name: string,
  conventionFormat: ConventionList
): INamingConventionSuggestion {
  switch (conventionFormat) {
    case ConventionList.CamelCase:
      return { isValid: isCamelCase(name), suggestedName: toCamelCase(name) };
    case ConventionList.PascalCase:
      return { isValid: isPascalCase(name), suggestedName: toPascalCase(name) };
    case ConventionList.SnakeCase:
      return { isValid: isSnakeCase(name), suggestedName: toSnakeCase(name) };
    case ConventionList.KebabCase:
      return { isValid: isKebabCase(name), suggestedName: toKebabCase(name) };
    default:
      throw new Error(`Unsupported convention: ${conventionFormat}`);
  }
}
