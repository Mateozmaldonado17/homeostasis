# HomeostasisJS

## 🚀 Control the Entropy of Your JavaScript Projects ##

HomeostasisJS is a linter specifically designed for the structure of your JavaScript projects. This tool enables you to define and enforce clear rules for organizing folders and files, ensuring that your project's growth remains consistent and maintainable.

As projects grow, it's common for their structure to become chaotic, leading to challenges such as:

- **Difficulty locating files.**
- **High maintenance costs.**
- **Steep learning curves for new developers.**

---

### **Why HomeostasisJS?**

HomeostasisJS addresses these issues by allowing you to define project conventions early on and ensuring they are automatically enforced. This creates a system of **negative feedback** within your projects, reducing entropy and fostering a more structured and consistent architecture.

- **📁 Maintain Order:** Avoid chaos as your codebase grows.
- **✅ Enforce Rules Automatically:** Validate naming conventions, folder structures, and file formats without manual effort.
- **🌱 Scale with Confidence:** Keep your project maintainable as your team or codebase expands.

By proactively managing your project’s structure, you can achieve a state of balance and organization—**homeostasis**—through consistent and enforceable rules.

### How HomeostasisJS Works
1. Reads the `descriptor.js` file in the target folder.
2. Validates directories and files based on the rules defined in `directories` and `files`.
3. Executes registered plugins and triggers hooks during specific validation steps.
4. Generates logs or modifies the file structure as per the configuration.


1. **Installs the library globally**

```bash
npm install -g homeostasis
```

2. **Create a Descriptor File:**  
   In each folder you want to manage, include a descriptor.js file containing the specific configuration for that folder. For example:

```javascript
const config = {
  plugins: [],
  directories: {
    strict_content: false,
    purgeOnStrict: true,
    autoFormatting: true,
    convention: "kebab-case",
    ignore: ["dist"],
    content: [
      {
        name: "components",
        motivation:
          "Encapsulate reusable UI elements to promote modularity and consistency across the application",
      },
      {
        name: "services",
        motivation:
          "Handle business logic and external API interactions, ensuring a clean separation of concerns.",
      },
      {
        name: "repositories",
        motivation:
          "Manage data access and storage, acting as a bridge between the application and its data sources.",
      },
      {
        name: "utils",
        motivation:
          "Provide utility functions and helpers to streamline common operations and avoid code duplication.",
      },
    ],
  },
  files: {
    strict_content: false,
    purgeOnStrict: true,
    autoFormatting: true,
    removeIfFormatIsInvalid: true,
    content: [
      {
        name: "index.ts",
      },
      {
        name: "descriptor.js",
      },
    ],
    ignore: [],
    allowedFormats: [".ts", ".js"],
    convention: "kebab-case",
  },
};

module.exports = config;
```
- **`plugins`:** Plugins are customizable modules that allow you to extend and modify the default behavior of the library. Through events (hooks), plugins can intervene at different stages of the flow, such as validations, renaming, or handling conventions.
- **`directories`:** Rules for folders (strict or convention-based).
- **`files`:** Rules for files, including file limits and expected content.

Supported conventions: `camel-case`, `snake-case`, `kebab-case`, `pascal-case`.

3. **Run Homeostasis**

```bash
homeostasis ./path/to/your/project
```

# Properties Table: directories and files

| Property | Type | Description |
|---|---|---|
| `strict_content` | boolean | Enforces strict validation of the directory or file structure. If enabled, only items listed in `content` are allowed. |
| `purgeOnStrict` | boolean | If `strict_content` is enabled, removes all files or directories not listed in the `content` array. |
| `convention` | string | Specifies the naming convention to enforce (e.g., kebab-case, snake-case, camel-case, pascal-case). |
| `ignore` | string[] | A list of files or directories to be ignored during validation. |
| `autoFormatting` | boolean | Automatically renames files or directories to comply with the naming convention. |
| `content` | Array<{ name: string, motivation?: string }> | Specifies the required content. Each item is an object with a `name` and optional `motivation`. |
| `allowedFormats` | string[] | (**files property**)  A list of allowed file formats (e.g., [".ts", ".js", ".jsx"]). Files with extensions not included in this list will trigger hooks like `onInvalidFormat` and potentially `onRemoveIfFormatIsInvalid`. |
| `removeIfFormatIsInvalid` | boolean | (**files property**) If set to `true`, files with invalid formats (not listed in `allowedFormats`) will be automatically removed. | 

# File-Specific Properties Table

| Property | Type | Description |
|---|---|---|
| `allowedFormats` | string[] | Specifies the allowed file extensions (e.g., [".ts", ".js"]). Files with extensions not included in this list will trigger hooks like `onInvalidFormat` and potentially `onRemoveIfFormatIsInvalid`. |
| `removeIfFormatIsInvalid` | boolean | If enabled, removes files that do not match the allowed formats specified in `allowedFormats`. |

## Plugins

### Hooks Availables

| Hook | Description |
|---|---|
| `onStrictContentValidation` | Triggered during strict content validation to ensure files and directories meet defined rules. |
| `onPurgeOnStrict` | Triggered when files or directories are removed because they do not comply with strict content rules. |
| `onInvalidConventionFilename` | Triggered when a file does not conform to the naming convention specified in the configuration. |
| `onInvalidConventionInDescriptor` | Triggered when the naming convention in the descriptor is invalid or does not comply with the rules. |
| `onInvalidConventionAndRename` | Triggered when a file or directory is renamed to meet the specified naming convention. |
| `onIgnore` | 	Triggered when a file or directory matches an item in the ignored list. |
| `onRemoveIfFormatIsInvalid` | Triggered when a file is removed because its format is not allowed. |
| `onInvalidFormat` | Triggered when a file has an invalid or unsupported format based on the configuration. |
| `onAutoFormatting` | Triggered when automatic formatting is applied to file or directory names to meet naming conventions. |

## Arguments Passed to Hooks

Each hook receives an `args` object that contains relevant data for the specific context of the event. Here's an example of common arguments:

| Argument | Description |
|---|---|
| `currentType` | The type of the current item being processed (e.g., "file" or "directory"). |
| `isDirectoryOrFile` | Boolean indicating whether the item is a directory or a file. |
| `filteredMappedContent` | Processed content of the directory or file. |
| `descriptorContent` | The content of the `descriptor.js` configuration. |
| `ignoredFiles` | An array of files or directories marked as ignored. |
| `conventionFormat` | The naming convention being validated (e.g., "kebab-case"). |
| `formatFiles` | The list of valid file formats allowed by the configuration. |
| `removeIfFormatIsInvalid` | Boolean indicating whether invalid format files should be removed. |
| `originalName` | The original name of the file or directory being renamed. |
| `newName` | The new name applied after renaming to meet the convention. |

# Plugin Example: StrictContentValidationPlugin

This example demonstrates a plugin that performs strict content validation and enforces naming conventions.

```javascript
class StrictContentValidationPlugin {
  name = "StrictContentValidationPlugin";

  /**
   * Triggered during strict content validation.
   */
  onStrictContentValidation(args) {
    console.log(`[${this.name}] onStrictContentValidation triggered.`);
    console.log(`Args:`, args);
  }

  /**
   * Triggered when purging files or directories due to strict content rules.
   */
  onPurgeOnStrict(args) {
    console.log(`[${this.name}] onPurgeOnStrict triggered.`);
    console.log(`Args:`, args);
  }

  /**
   * Triggered when a file does not meet the naming convention.
   */
  onInvalidConventionFilename(args) {
    console.log(`[${this.name}] onInvalidConventionFilename triggered.`);
    console.log(`Args:`, args);
  }

  /**
   * Triggered when the descriptor file contains invalid conventions.
   */
  onInvalidConventionInDescriptor(args) {
    console.log(`[${this.name}] onInvalidConventionInDescriptor triggered.`);
    console.log(`Args:`, args);
  }

  /**
   * Triggered when renaming files or directories to meet the naming convention.
   */
  onInvalidConventionAndRename(args) {
    console.log(`[${this.name}] onInvalidConventionAndRename triggered.`);
    console.log(`Args:`, args);
  }

  /**
   * Triggered when a file or directory is ignored.
   */
  onIgnore(args) {
    console.log(`[${this.name}] onIgnore triggered.`);
    console.log(`Args:`, args);
  }

  /**
   * Triggered when a file format is invalid and is removed.
   */
  onRemoveIfFormatIsInvalid(args) {
    console.log(`[${this.name}] onRemoveIfFormatIsInvalid triggered.`);
    console.log(`Args:`, args);
  }

  /**
   * Triggered when a file format is invalid.
   */
  onInvalidFormat(args) {
    console.log(`[${this.name}] onInvalidFormat triggered.`);
    console.log(`Args:`, args);
  }

  /**
   * Triggered when auto-formatting is applied.
   */
  onAutoFormatting(args) {
    console.log(`[${this.name}] onAutoFormatting triggered.`);
    console.log(`Args:`, args);
  }
}
```

# Plugin Implementation Example

This example demonstrates how to implement the `StrictContentValidationPlugin` in your configuration file.

```javascript
const StrictContentValidationPlugin = require('./plugins/StrictContentValidationPlugin');

const config = {
  plugins: [
    new StrictContentValidationPlugin(),
  ],
  directories: {
    strict_content: true,
    purgeOnStrict: true,
    convention: "kebab-case",
    ignore: ["dist"],
    content: [
      { name: "components" },
      { name: "services" },
    ],
  },
  files: {
    allowedFormats: [".ts", ".js"],
    removeIfFormatIsInvalid: true,
  },
};

module.exports = config;