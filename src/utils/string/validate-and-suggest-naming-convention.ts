import { ConventionList } from '../../models/IDescriptor';
import { isCamelCase, toCamelCase } from "./camel-case";
import { isValidRegex, validateWithRegex } from "./regex-functions";
import { isKebabCase, toKebabCase } from "./kebab-case";
import { isPascalCase, toPascalCase } from "./pascal-case";
import { isSnakeCase, toSnakeCase } from "./snake-case";

interface INamingConventionSuggestion {
  isValid: boolean;
  suggestedName: string;
}

export function validateAndSuggestNamingConvention(
  name: string,
  conventionFormat: string
): INamingConventionSuggestion {

  const standardFormats: Record<string, { isValid: (name: string) => boolean; toFormat: (name: string) => string }> = {
    [ConventionList.CamelCase]: { isValid: isCamelCase, toFormat: toCamelCase },
    [ConventionList.PascalCase]: { isValid: isPascalCase, toFormat: toPascalCase },
    [ConventionList.SnakeCase]: { isValid: isSnakeCase, toFormat: toSnakeCase },
    [ConventionList.KebabCase]: { isValid: isKebabCase, toFormat: toKebabCase },
  };

  if (conventionFormat in standardFormats) {
    const { isValid, toFormat } = standardFormats[conventionFormat];
    return { isValid: isValid(name), suggestedName: toFormat(name) };
  }
  
  if (isValidRegex(conventionFormat)) {
    return {
      isValid: validateWithRegex(conventionFormat, name),
      suggestedName: name.replace(new RegExp(conventionFormat, "g"), ""),
    };
  }

  throw new Error(`Unsupported convention: ${conventionFormat}`);
}
