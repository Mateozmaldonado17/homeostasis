#!/usr/bin/env node

"use strict";

import { INode } from "./models";
import {
  existsInDirectory,
} from "./services/descriptor-service/descriptor-service";
import IResponse from "./models/IResponse";
import { sendLog } from "./utils/logger";
import { extractDirectoryStructure, readDirectory } from "./services/file-system-service";
import runValidations from "./services/validation-service/runner";

const globalResponses: IResponse[] = [];

async function main(dest: string): Promise<void> {
  try {
    if ((await existsInDirectory(dest)) === false) {
      throw new Error(
        "We couldn't find the main descriptor file in this project"
      );
    }

    const { contentSettings, contents } = await extractDirectoryStructure(dest);

    const rootNodeRefactored: Partial<INode> = {
      content: contents,
      contentSettings: contentSettings,
      fullDestination: dest,
    };

    await runValidations(rootNodeRefactored, globalResponses);

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
