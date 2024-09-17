type AVLTreeNode = {
    value: number;
    left: AVLTreeNode | null;
    right: AVLTreeNode | null;
    height: number;
    x: number;
    y: number;
    highlight: boolean;
  };
  
const getHeight = (node: AVLTreeNode | null): number => {
    return node ? node.height : 0;
  };
  
  const getBalanceFactor = (node: AVLTreeNode | null): number => {
    if (!node) return 0;
    return getHeight(node.left) - getHeight(node.right);
  };
  

  const rightRotate = (y: AVLTreeNode): AVLTreeNode => {
    const x = y.left!;
    const T2 = x.right;
  
    // Perform rotation
    x.right = y;
    y.left = T2;
  
    // Update heights
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  
    // Update positions
    x.x = y.x; // x takes y's position
    y.x += 50; // Adjust y's position to the right
    if (T2) T2.x -= 50; // Adjust T2's position to the left if exists
  
    return x; // Return new root
  };
  
  const leftRotate = (x: AVLTreeNode): AVLTreeNode => {
    const y = x.right!;
    const T2 = y.left;
  
    // Perform rotation
    y.left = x;
    x.right = T2;
  
    // Update heights
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  
    // Update positions
    y.x = x.x; // y takes x's position
    x.x -= 50; // Adjust x's position to the left
    if (T2) T2.x += 50; // Adjust T2's position to the right if exists
  
    return y; // Return new root
  };
  
  
  const insertAVL = (node: AVLTreeNode | null, value: number, x: number = 0, y: number = 0): AVLTreeNode => {
    if (node === null) {
      return {
        value,
        left: null,
        right: null,
        height: 1,
        x,
        y,
        highlight: false,
      };
    }
  
    if (value < node.value) {
      node.left = insertAVL(node.left, value, x - 50, y + 50);
    } else if (value > node.value) {
      node.right = insertAVL(node.right, value, x + 50, y + 50);
    } else {
      return node; 
    }
  
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    const balance = getBalanceFactor(node);
  
    if (balance > 1 && value < (node.left?.value ?? 0)) {
      return rightRotate(node);
    }
  
    if (balance < -1 && value > (node.right?.value ?? 0)) {
      return leftRotate(node);
    }
  
    if (balance > 1 && value > (node.left?.value ?? 0)) {
      node.left = leftRotate(node.left!);
      return rightRotate(node);
    }
  
    if (balance < -1 && value < (node.right?.value ?? 0)) {
      node.right = rightRotate(node.right!);
      return leftRotate(node);
    }
  
    return node;
  };

export default insertAVL;