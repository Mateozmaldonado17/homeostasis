#!/usr/bin/env node

"use strict";
import * as fs from "fs";
import { IDescriptor, INode } from "./models";
import {
  descriptorFile,
  existsInDirectory,
} from "./services/DescriptorService";
import { readDirectory } from "./services/FileSystemService";
import { traverseNodes } from "./services/NodeService";
import * as Logger from "./utils/logger/Logger";
import IError from "./models/IError";
import  {
  formatValidation,
} from "./services/ValidationService";

import { strictContentValidator, validateRequiredContent } from "./services/validation-service";
import validateNamingConventions from "./services/validation-service/validators/validate-naming-conventions";
import { ErrorTypeEnum } from "./enums";

const globalErrors: IError[] = [];

const runValidations = async (mainNode: Partial<INode>): Promise<void> => {
  const contents = mainNode.content as INode[];

  const fullDestination = mainNode.fullDestination;

  const contentSetting = mainNode.contentSettings;

  for (const content of contents) {
    const ignoredDirectories = contentSetting?.directories.ignore;
    const ignoredFiles = contentSetting?.files.ignore;

    const thisFileOrDirShouldBeIgnore =
      ignoredDirectories?.includes(content.name) ||
      ignoredFiles?.includes(content.name);
    
    if (content.isIterable && !thisFileOrDirShouldBeIgnore) {
      runValidations(content as Partial<INode>);
    }
  }

  const strictContentResult = strictContentValidator(
    contentSetting as IDescriptor,
    contents
  );

  if (strictContentResult.errors.length)
    globalErrors.push(...strictContentResult.errors);

  const contentValidationResult = validateRequiredContent(
    contents,
    contentSetting as IDescriptor,
    fullDestination as string
  );

  if (contentValidationResult.errors.length)
    globalErrors.push(...contentValidationResult.errors);

  const conventionValidationResult = validateNamingConventions(
    contents,
    contentSetting as IDescriptor
  );

  if (conventionValidationResult.errors.length)
    globalErrors.push(...conventionValidationResult.errors);

  // const formatValidationResult = formatValidation(
  //   contents,
  //   contentSetting as IDescriptor
  // );

  // if (formatValidationResult.errors.length)
  //   globalErrors.push(...formatValidationResult.errors);
};

async function main(dest: string): Promise<void> {
  try {
    if ((await existsInDirectory(dest)) === false) {
      throw new Error(
        "We couldn't find the main descriptor file in this project"
      );
    }
    const rootNode: INode[] = await readDirectory(dest);
    await traverseNodes(rootNode);

    const rawData = fs.readFileSync(`${dest}/${descriptorFile}`, "utf8");
    const data: IDescriptor = JSON.parse(rawData);

    const rootNodeRefactored: Partial<INode> = {
      content: rootNode,
      contentSettings: data,
      fullDestination: dest,
    };
    await runValidations(rootNodeRefactored);

    console.log("[Homeostasis]");
    if (globalErrors.length)
      throw new Error(`⚠ ${globalErrors.length} errors found`);
    if (!globalErrors.length) console.log("✅ errors not found");
  } catch (error: any) {
    console.log(error.message);
    globalErrors.map((error: IError) => {
      Logger.sendLog({ errorType: ErrorTypeEnum.ERROR, message: error.errorMessage});
    });
  }
}

const params = process.argv.slice(2);
main(params[0]);
