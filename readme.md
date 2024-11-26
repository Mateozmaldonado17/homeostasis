# HomeostasisJS

## 🚀 Control the Entropy of Your JavaScript Projects ##

HomeostasisJS is a linter specifically designed for the structure of your JavaScript projects. This tool enables you to define and enforce clear rules for organizing folders and files, ensuring that your project's growth remains consistent and maintainable.

As projects grow, it's common for their structure to become chaotic, leading to challenges such as:

- **Difficulty locating files.**
- **High maintenance costs.**
- **Steep learning curves for new developers.**

---

### **¿Why HomeostasisJS?**

HomeostasisJS addresses these issues by allowing you to define project conventions early on and ensuring they are automatically enforced. This creates a system of **negative feedback** within your projects, reducing entropy and fostering a more structured and consistent architecture.

- **📁 Maintain Order:** Prevent the chaos that naturally arises as your codebase expands.
- **✅ Enforce Rules Automatically:** Prevent the chaos that naturally arises as your codebase expands.
- **🌱 Scale with Confidence:** Prevent the chaos that naturally arises as your codebase expands.

Keep your projects in homeostasis—a state of balance and organization—by managing the structure proactively from day one.

1. **Installs the library globally**

```bash
npm install -g homeostasis
```

2. **Create a Descriptor File:**  
   In each folder you want to manage, include a descriptor.js file containing the specific configuration for that folder. For example:

```javascript
const config = {
  directories: {
    strict_content: false,
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

- **`directories`:** Rules for folders (strict or convention-based).
- **`files`:** Rules for files, including file limits and expected content.

Supported conventions: `camel-case`, `snake-case`, `kebab-case`, `pascal-case`.

3. **Run Homeostasis**

```bash
homeostasis ./path/to/your/project
```
