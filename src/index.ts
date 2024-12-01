#!/usr/bin/env node

"use strict";

import { IDescriptor, INode } from "./models";
import {
  descriptorFile,
  existsInDirectory,
  loadJSModule,
} from "./services/descriptor-service/descriptor-service";
import { traverseNodes } from "./services/node-service/node-service";
import { strictContentValidator, validateRequiredContent } from "./services/validation-service";
import validateNamingConventions from "./services/validation-service/validators/validate-naming-conventions";
import IResponse from "./models/IResponse";
import checkFileFormatCompliance from "./services/validation-service/validators/check-file-format-compliance";
import { sendLog } from "./utils/logger";
import { readDirectory } from "./services/file-system-service";

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

  const formatValidationResult = checkFileFormatCompliance(
    contents,
    contentSetting as IDescriptor
  );

  if (formatValidationResult.responses.length)
    globalResponses.push(...formatValidationResult.responses);

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
    const data = await loadJSModule<IDescriptor>(`${dest}/${descriptorFile}`);
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
  } catch (response: any) {
    console.log(response.message);
    globalResponses.map((response: IResponse) => {
      sendLog({ logType: response.logType, message: response.message });
    });
  }
}

const params = process.argv.slice(2);
main(params[0]);
