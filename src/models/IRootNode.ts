import IDescriptor from "./IDescriptor";
import INode from "./INode";

interface IRootNode {
  descriptor: IDescriptor,
  structure: INode[]
}

export default IRootNode;