import * as fs from "fs";

interface INode {
  Name: string;
  FullDestination: string;
  IsIterable: boolean;
  IsDirectory: boolean;
  Content: INode[] | null,
  IsVisited: boolean;
}

const DescriptorFile = "descriptor.json";
const params = process.argv.slice(2);
let rootNode: INode[] = [];

const GetDescriptorFile = async (dest: string): Promise<boolean> => {
  return await fs.existsSync(dest + "/" + DescriptorFile);
}

const ReadDestAndGetMetadata = async (destination: string): Promise<INode[]> => {
  const AllFiles = await fs.promises.readdir(destination);
  const StructureMap = AllFiles.map(async (file) => {

    const NewNode: INode = {
      Name: "",
      FullDestination: "",
      IsDirectory: false,
      IsIterable: false,
      Content: null,
      IsVisited: false
    };

    const FullPath = `${destination}/${file}`;
    const FileMetatada = await fs.promises.stat(FullPath);
    const IsDirectory = FileMetatada.isDirectory();

    NewNode.Name = file;
    NewNode.FullDestination = FullPath;
    NewNode.IsDirectory = IsDirectory;

    if (FileMetatada.isDirectory()) {
      const HasDescriptorFile = await GetDescriptorFile(FullPath);
      NewNode.IsIterable = await HasDescriptorFile;
    }

    return NewNode;
  });
  return Promise.all(StructureMap);
};

const TraverseNodesRecursively = async (nodes: INode[]): Promise<void | boolean> => {
  for (const node of nodes) {
    const Content = node.Content;
    const IsIterableAndNotVisited = node.IsIterable && !node.IsVisited;
    if (IsIterableAndNotVisited) return false;
    node.IsVisited = true;
    node.Content = await ReadDestAndGetMetadata(node.FullDestination);
    if (Content) {
      await TraverseNodesRecursively(Content);
    }
  }
};

async function main(dest: string): Promise<void> {
  try {
    const ExistDescriptorFile = await GetDescriptorFile(dest);
    if (!ExistDescriptorFile) {
      throw new Error("We couldn't find the main descriptor file in this project");
    }
    rootNode = await ReadDestAndGetMetadata(dest);
    await TraverseNodesRecursively(rootNode);

    console.log(JSON.stringify(rootNode, null, 2));
  } catch (error: any) {
    console.error(error.message);
  }
}

main(params[0]);
