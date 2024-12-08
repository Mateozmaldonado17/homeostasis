const isValidRegex = (pattern: string) => {
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
};

const validateWithRegex = (dynamicRegex: string, text: string) => {
  try {
    const regex = new RegExp(dynamicRegex);
    return regex.test(text);
  } catch (e) {
    return false;
  }
}

const formatText = (
  regex: RegExp,
  textToFormat: string,
  replacer: string | ((substring: string, ...args: any[]) => string)
): string => {
  return textToFormat.replace(regex, replacer as string);
}

export { isValidRegex, validateWithRegex, formatText};
