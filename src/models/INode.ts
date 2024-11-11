interface INode {
  Name: string;
  FullDestination: string;
  IsIterable: boolean;
  IsDirectory: boolean;
  Content: INode[] | null;
  IsVisited: boolean;
}

export default INode;