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
import * as Logger from "./utils/Logger";
import IError from "./models/IError";
import {
  contentValidation,
  conventionValidation,
  formatValidation,
  strictContentValidation,
} from "./services/ValidationService";

const globalErrors: IError[] = [];

const runValidations = async (mainNode: Partial<INode>): Promise<void> => {
  const contents = mainNode.content as INode[];

  const fullDestination = mainNode.fullDestination;

  const contentSetting = mainNode.contentSettings;

  for (const content of contents) {
    const ignoreDirectories = contentSetting?.directories.ignore;
    const ignoreFiles = contentSetting?.files.ignore;

    const thisFileOrDirShouldBeIgnore =
      ignoreDirectories?.includes(content.name) ||
      ignoreFiles?.includes(content.name);

    const strictContentResult = strictContentValidation(
      contentSetting as IDescriptor,
      content
    );
    if (strictContentResult.errors.length)
      globalErrors.push(...strictContentResult.errors);
    if (content.isIterable && !thisFileOrDirShouldBeIgnore) {
      runValidations(content as Partial<INode>);
    }
  }
  const contentValidationResult = contentValidation(
    contents,
    contentSetting as IDescriptor,
    fullDestination as string
  );
  if (contentValidationResult.errors.length)
    globalErrors.push(...contentValidationResult.errors);

  const conventionValidationResult = conventionValidation(
    contents,
    contentSetting as IDescriptor
  );
  if (conventionValidationResult.errors.length)
    globalErrors.push(...conventionValidationResult.errors);

  const formatValidationResult = formatValidation(
    contents,
    contentSetting as IDescriptor
  );
  if (formatValidationResult.errors.length)
    globalErrors.push(...formatValidationResult.errors);
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
      Logger.error(error.errorMessage);
    });
  }
}

const params = process.argv.slice(2);
main(params[0]);
