import IDescriptor from "./IDescriptor";

interface INode {
  name: string;
  fullDestination: string;
  isIterable: boolean;
  isDirectory: boolean;
  content: INode[] | null;
  isVisited: boolean;
  contentSettings: IDescriptor | null
}

export default INode;