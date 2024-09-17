type Node = {
    value: number;
    left: Node | null;
    right: Node | null;
    x: number;
    y: number;
    highlight: boolean;
  };

const insertBST = (node: Node | null, value: number, x: number = 0, y: number = 0): Node => {
    if (node === null) {
      return {
        value,
        left: null,
        right: null,
        x,
        y,
        highlight: false,
      };
    }

    if (value < node.value) {
      node.left = insertBST(node.left, value, x, y);
    } else if (value > node.value) {
      node.right = insertBST(node.right, value, x, y);
    }
    return node;
  };

  export default insertBST;