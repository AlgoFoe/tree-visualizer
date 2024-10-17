type RBTreeNode = {
    value: number;
    left: RBTreeNode | null;
    right: RBTreeNode | null;
    color: 'R' | 'B';
    parent: RBTreeNode | null;
    x: number;
    y: number;
    highlight: boolean;
  };

  // no rotation initially   

  let ll = false; // Left-Left 
  let rr = false; // Right-Right 
  let lr = false; // Left-Right 
  let rl = false; // Right-Left 
  
  const rotateLeft = (node: RBTreeNode): RBTreeNode => {
    const x = node.right!;
    const y = x.left;
  
    x.left = node;
    node.right = y;
  
    x.parent = node.parent;
    node.parent = x;
    if (y !== null) {
      y.parent = node;
    }
    return x;  
  };
  
  const rotateRight = (node: RBTreeNode): RBTreeNode => {
    const x = node.left!;
    const y = x.right;
  
    x.right = node;
    node.left = y;
  
    x.parent = node.parent;
    node.parent = x;
    if (y !== null) {
      y.parent = node;
    }
  
    return x;
  };
  
  const insertHelp = (root: RBTreeNode | null, data: number): RBTreeNode => {
    let conflict = false;
  
    if (root === null) {
      return {
        value: data,
        left: null,
        right: null,
        color: 'R',     
        parent: null,
        x: 0,
        y: 0,
        highlight: false,
      };
    }
  
    if (data < root.value) {
      root.left = insertHelp(root.left, data);
      root.left!.parent = root;
  
      if (root.color === 'R' && root.left!.color === 'R') {
        conflict = true;
      }
    } else if (data > root.value) {
      root.right = insertHelp(root.right, data);
      root.right!.parent = root;
  
      if (root.color === 'R' && root.right!.color === 'R') {
        conflict = true;
      }
    }
  
    if (ll) {
      root = rotateLeft(root);
      root.color = 'B';
      root.left!.color = 'R';
      ll = false;
    } else if (rr) {
      root = rotateRight(root);
      root.color = 'B';
      root.right!.color = 'R';
      rr = false;
    } else if (rl) {
      root.right = rotateRight(root.right!);
      root.right!.parent = root;
      root = rotateLeft(root);
      root.color = 'B';
      root.left!.color = 'R';
      rl = false;
    } else if (lr) {
      root.left = rotateLeft(root.left!);
      root.left!.parent = root;
      root = rotateRight(root);
      root.color = 'B';
      root.right!.color = 'R';
      lr = false;
    }
  
    // handle Red-Red conflicts
    if (conflict) {
      if (root.parent!.right === root) {
        const uncle = root.parent!.left;
        if (uncle === null || uncle.color === 'B') {
          if (root.left !== null && root.left.color === 'R') {
            rl = true;
          } else if (root.right !== null && root.right.color === 'R') {
            ll = true;
          }
        } else {
          root.parent!.left!.color = 'B';
          root.color = 'B';
          if (root.parent!.parent !== null) {
            root.parent!.color = 'R';
          }
        }
      } else {
        const uncle = root.parent!.right;
        if (uncle === null || uncle.color === 'B') {
          if (root.left !== null && root.left.color === 'R') {
            rr = true;
          } else if (root.right !== null && root.right.color === 'R') {
            lr = true;
          }
        } else {
          root.parent!.right!.color = 'B';
          root.color = 'B';
          if (root.parent!.parent !== null) {
            root.parent!.color = 'R';
          }
        }
      }
      conflict = false;
    }
  
    return root;
  };
  
  const insertRedBlackTree = (root: RBTreeNode | null, value: number): RBTreeNode => {
    root = insertHelp(root, value);
    root.color = 'B'; 
    return root;
  };
  
  export default insertRedBlackTree;
  