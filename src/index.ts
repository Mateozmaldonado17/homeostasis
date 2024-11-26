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

import { strictContentValidator, validateRequiredContent } from "./services/validation-service";
import validateNamingConventions from "./services/validation-service/validators/validate-naming-conventions";
import { SystemLogTypeEnum } from "./enums";
import IResponse from "./models/IResponse";

const globalResponses: IResponse[] = [];

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

  if (strictContentResult.responses.length)
    globalResponses.push(...strictContentResult.responses);

  const contentValidationResult = validateRequiredContent(
    contents,
    contentSetting as IDescriptor,
    fullDestination as string
  );

  if (contentValidationResult.responses.length)
    globalResponses.push(...contentValidationResult.responses);

  const conventionValidationResult = validateNamingConventions(
    contents,
    contentSetting as IDescriptor
  );

  if (conventionValidationResult.responses.length)
    globalResponses.push(...conventionValidationResult.responses);

  // const formatValidationResult = formatValidation(
  //   contents,
  //   contentSetting as IDescriptor
  // );

  // if (formatValidationResult.errors.length)
  //   globalResponses.push(...formatValidationResult.errors);
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
    if (globalResponses.length)
      throw new Error(`(\x1b[1;31m${globalResponses.length}\x1b[0m) Errors found.`);
    if (!globalResponses.length) console.log("\x1b[1;32m0\x1b[0m Errors found. Everything looks perfect! 🎉");
  } catch (error: any) {
    console.log(error.message);
    globalResponses.map((error: IResponse) => {
      Logger.sendLog({ errorType: SystemLogTypeEnum.ERROR, message: error.message});
    });
  }
}

const params = process.argv.slice(2);
main(params[0]);
