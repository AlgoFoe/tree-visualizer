type Node = {
    value: number;
    left: Node | null;
    right: Node | null;
    x: number;
    y: number;
    highlight: boolean;
  };
  
const buildBinaryTree = (values: number[]): Node | null => {
    if (values.length === 0) return null;
  
    const nodes: Node[] = values.map((value) => ({
      value,
      left: null,
      right: null,
      x: 0,
      y: 0,
      highlight: false,
    }));
  
    for (let i = 0; i < nodes.length; i++) {
      if (2 * i + 1 < nodes.length) nodes[i].left = nodes[2 * i + 1];
      if (2 * i + 2 < nodes.length) nodes[i].right = nodes[2 * i + 2];
    }
  
    return nodes[0]; 
  };
export default buildBinaryTree;