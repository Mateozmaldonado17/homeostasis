interface INode {
  name: string;
  fullDestination: string;
  isIterable: boolean;
  isDirectory: boolean;
  content: INode[] | null;
  isVisited: boolean;
}

export default INode;