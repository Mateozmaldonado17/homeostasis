import { INode } from "../../models";
import IResponse from "../../models/IResponse";
import {
  checkFileFormatCompliance,
  strictContentValidator,
  validateNamingConventions,
  validateRequiredContent,
} from "./validators";

const runValidations = async (
  mainNode: Partial<INode>,
  globalResponses: IResponse[]
): Promise<void> => {
  const contents = mainNode.content as INode[];
  const fullDestination = mainNode.fullDestination;
  const contentSetting = mainNode.contentSettings;

  for (const content of contents) {
    const ignoredDirectories = contentSetting?.directories.ignore;
    const ignoredFiles = contentSetting?.files.ignore;

    const thisFileOrDirShouldBeIgnored =
      ignoredDirectories?.includes(content.name) ||
      ignoredFiles?.includes(content.name);

    if (content.isIterable && !thisFileOrDirShouldBeIgnored) {
      await runValidations(content as Partial<INode>, globalResponses);
    }
  }

  const validators = [
    strictContentValidator,
    validateRequiredContent,
    validateNamingConventions,
    checkFileFormatCompliance,
  ];

  for (const validator of validators) {
    const result = await validator(fullDestination as string);
    if (result.responses.length) globalResponses.push(...result.responses);
  }
};

export default runValidations;
