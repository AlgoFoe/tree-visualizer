"use client";
import insertAVL from "@/utils/avlTree";
import insertBST from "@/utils/binarySearchTree";
import buildBinaryTree from "@/utils/binaryTree";
import insertHeap from "@/utils/heapTree";
import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

type Node = {
  value: number;
  left: Node | null;
  right: Node | null;
  x: number;
  y: number;
  highlight: boolean;
};

type AVLTreeNode = {
  value: number;
  left: AVLTreeNode | null;
  right: AVLTreeNode | null;
  height: number;
  x: number;
  y: number;
  highlight: boolean;
};

const TreeVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 100 });
  const [inputValue, setInputValue] = useState("");
  const [binaryTree, setBinaryTree] = useState<Node | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pressed, setPressed] = useState({
    bst: false,
    avl: false,
    heap: false,
    bt: false,
    btree: false,
  });
  const resetHighlight = useCallback((node: Node | null) => {
    if (node) {
      node.highlight = false;
      resetHighlight(node.left);
      resetHighlight(node.right);
    }
  }, []);

  const findClickedNode = useCallback(
    (node: Node | null, x: number, y: number): Node[] => {
      if (!node) return [];
      const radius = 25;
      const centerX = node.x + radius;
      const centerY = node.y + radius;

      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= radius) return [node];

      const left = findClickedNode(node.left, x, y);
      if (left.length > 0) return [node, ...left];

      const right = findClickedNode(node.right, x, y);
      if (right.length > 0) return [node, ...right];

      return [];
    },
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleBST = () => {
    setPressed((prevPressed) => ({
      ...prevPressed,
      heap: false,
      bst: true,
      avl: false,
      bt: false,
    }));
    const values = inputValue.split(",").map((value) => parseInt(value.trim()));

    if (values.some((value) => isNaN(value))) {
      toast.error("Not a number", { duration: 4000, position: "top-center" });
      return;
    }

    let newBinaryTree: Node | null = null;
    values.forEach((value) => {
      newBinaryTree = insertBST(newBinaryTree, value);
    });
    setBinaryTree(newBinaryTree);
  };

  const handleBT = () => {
    setPressed((prevPressed) => ({
      ...prevPressed,
      heap: false,
      bst: false,
      avl: false,
      bt: true,
    }));
    const values = inputValue.split(",").map((value) => parseInt(value.trim()));

    if (values.some((value) => isNaN(value))) {
      toast.error("Not a number", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    const newBinaryTree = buildBinaryTree(values);
    setBinaryTree(newBinaryTree);
  };

  const handleAVLT = () => {
    setPressed((prevPressed) => ({
      ...prevPressed,
      heap: false,
      bst: false,
      avl: true,
      bt: false,
    }));
    const values = inputValue.split(",").map((value) => parseInt(value.trim()));

    if (values.some((value) => isNaN(value))) {
      toast.error("Not a number", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    let newAVLTree: AVLTreeNode | null = null;
    values.forEach((value) => {
      newAVLTree = insertAVL(newAVLTree, value);
    });
    setBinaryTree(newAVLTree);
  };

  const buildBinaryTreeFromArray = (nodes: Node[]): Node | null => {
    if (nodes.length === 0) return null;

    for (let i = 0; i < nodes.length; i++) {
      if (2 * i + 1 < nodes.length) nodes[i].left = nodes[2 * i + 1];
      if (2 * i + 2 < nodes.length) nodes[i].right = nodes[2 * i + 2];
    }

    return nodes[0];
  };

  const handleHeapT = () => {
    setPressed((prevPressed) => ({
      ...prevPressed,
      heap: true,
      bst: false,
      avl: false,
      bt: false,
    }));
    const values = inputValue.split(",").map((value) => parseInt(value.trim()));

    if (values.some((value) => isNaN(value))) {
      toast.error("Not a number", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    let newHeapTree: Node[] = [];
    values.forEach((value) => {
      newHeapTree = insertHeap(newHeapTree, value);
    });
    setBinaryTree(buildBinaryTreeFromArray(newHeapTree));
  };
  const calculateSubtreeWidth = (node:Node|null):number => {
    if (node === null) return 0;
    const leftWidth = calculateSubtreeWidth(node.left);
    const rightWidth = calculateSubtreeWidth(node.right);
    return leftWidth + rightWidth + 1;
  }
  const drawBinaryTree = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      node: Node | null,
      x: number,
      y: number,
      levelHeight: number, // fixed vertical distance between levels
      subtreeWidth: number // total width of the current subtree
    ) => {
      if (!node) return;
  
      node.x = x;
      node.y = y;
  
      const radius = 25 * zoomLevel;
      const centerX = x + radius;
      const centerY = y + radius;
  
      ctx.lineWidth = 2 * zoomLevel;
      ctx.beginPath();
      ctx.fillStyle = "#193145";
      ctx.strokeStyle = "#3a9bf0";
  
      if (node.highlight) ctx.fillStyle = "#3ab1cf";
  
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
  
      ctx.fillStyle = "white";
      ctx.font = `${20 * zoomLevel}px Verdana`;
      ctx.fillText(node.value.toString(), centerX - 12 * zoomLevel, centerY);
  
      const leftSubtreeWidth = calculateSubtreeWidth(node.left);
      const rightSubtreeWidth = calculateSubtreeWidth(node.right);
  
      // total width of the subtrees, and using it to position child nodes
      const totalSubtreeWidth = leftSubtreeWidth + rightSubtreeWidth + 1;
  
      if (node.left !== null){
        // x-coordinate for the left subtree, and using it to position child nodes
        const leftX = x - (subtreeWidth / totalSubtreeWidth) * leftSubtreeWidth * 50; // dynamic spacing
        const leftY = y + levelHeight;
  
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + radius);
        ctx.lineTo(leftX + radius, leftY);
  
        if (node.left.highlight) ctx.strokeStyle = "#3ab1cf";
        ctx.stroke();
  
        drawBinaryTree(ctx, node.left, leftX, leftY, levelHeight, leftSubtreeWidth);
      }
  
      if (node.right !== null) {
        const rightX = x + (subtreeWidth / totalSubtreeWidth) * rightSubtreeWidth * 50; // dynamic spacing
        const rightY = y + levelHeight;
        
  
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + radius);
        ctx.lineTo(rightX + radius, rightY);
        if (node.right.highlight) ctx.strokeStyle = "#3ab1cf";
        ctx.stroke();
  
        drawBinaryTree(ctx, node.right, rightX, rightY, levelHeight, rightSubtreeWidth);
      }
    },
    [zoomLevel]
  );

  const redrawBinaryTree = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.translate(centerX, centerY);
        ctx.scale(zoomLevel, zoomLevel);
        ctx.translate(-centerX, -centerY);

        const treeWidth = calculateSubtreeWidth(binaryTree); // total tree width

        drawBinaryTree(
          ctx,
          binaryTree,
          centerX,
          50 * zoomLevel,
          80 * zoomLevel, // vertical distance between levels
          treeWidth // passing the total tree width to position nodes
        );
        ctx.restore();
      }
    }
  }, [binaryTree, drawBinaryTree, zoomLevel]);

  const calculateCanvasSize = useCallback(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (binaryTree) {
      const treeWidth = calculateSubtreeWidth(binaryTree); // Get the total width of the tree
      const dx = 80 * zoomLevel; // Adjust the spacing factor based on zoom
      const dy = 80 * zoomLevel; // Vertical distance between levels

      // Dynamically calculate the width based on the tree's total width
      const dynamicTreeWidth = Math.max(1, treeWidth * dx); 

      const treeHeight = Math.max(1, dy * 6); // You can calculate treeHeight dynamically if needed

      // Adjust the canvas size based on the tree's size
      width = Math.max(dynamicTreeWidth + 150, window.innerWidth); // Add some padding for extra space
      height = Math.max(treeHeight + 150, window.innerHeight - 150); // Ensure height grows too
    }

    setCanvasSize({ width, height });
  }, [binaryTree, zoomLevel]);

  useEffect(() => {
    redrawBinaryTree();
    calculateCanvasSize();
  }, [binaryTree, calculateCanvasSize, zoomLevel, redrawBinaryTree]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight+50;
        calculateCanvasSize();
        redrawBinaryTree();
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [redrawBinaryTree,calculateCanvasSize]);
  // useEffect(() => {
  //   const handleResize = () => {
  //     calculateCanvasSize();
  //     redrawBinaryTree();
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [calculateCanvasSize, redrawBinaryTree]);

  const handleClick = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      resetHighlight(binaryTree);

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const node = findClickedNode(binaryTree, x, y);

      node.forEach((n) => {
        n.highlight = true;
      });
      redrawBinaryTree();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("click", handleClick);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("click", handleClick);
      }
    };
  }, [binaryTree, findClickedNode, redrawBinaryTree, resetHighlight]);
  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 0.5));
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="tree-input w-full max-w-lg">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="text-sky-400 font-bold outline-dashed outline-sky-400 p-2 w-full mb-4 focus:outline-emerald-700 focus:outline-2 outline-2"
          placeholder="Enter comma separated terms"
        />
        <div className="flex gap-2 justify-center mt-2 flex-wrap">
          <div
            onClick={handleBST}
            className={`${
              pressed.bst ? "bg-teal-600" : "bg-blue-500"
            }  button w-16 h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 ${pressed.bst && 'translate-y-2'} ${!pressed.bst && '[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]'}
            border-b-[1px] border-blue-400`}
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              BST
            </span>
          </div>
          <div
            onClick={handleBT}
            className={`${
              pressed.bt ? "bg-teal-600" : "bg-blue-500"
            }  button w-16 h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 ${pressed.bt && 'translate-y-2'} ${!pressed.bt && '[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]'}
            border-b-[1px] border-blue-400`}
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              BT
            </span>
          </div>
          <div
            onClick={handleAVLT}
            className={`${
              pressed.avl ? "bg-teal-600" : "bg-blue-500"
            }  button w-16 h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 ${pressed.avl && 'translate-y-2'} ${!pressed.avl && '[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]'}
            border-b-[1px] border-blue-400`}
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              AVL T
            </span>
          </div>
          <div
            onClick={handleHeapT}
            className={`${
              pressed.heap ? "bg-teal-600" : "bg-blue-500"
            }  button w-16 h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 ${pressed.heap && 'translate-y-2'} ${!pressed.heap && '[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]'}
            border-b-[1px] border-blue-400`}
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              Heap T
            </span>
          </div>
        </div>
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          <div
            onClick={handleZoomIn}
            className="button w-12 h-10 bg-rose-500 rounded-lg cursor-pointer select-none
            active:translate-y-2 active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
            border-b-[1px] border-x-teal-700"
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-4xl">
              +
            </span>
          </div>
          <div
            onClick={handleZoomOut}
            className="button w-12 h-10 bg-rose-500 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
            border-b-[1px] border-blue-400"
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-4xl ">
              -
            </span>
          </div>
        </div>
        {/* <div className={`h-[calc(100vh)] overflow-auto mt-8`}> */}
          <canvas
            className="mb-5 mt-5 overflow-auto"
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
          />
        {/* </div> */}
      </div>
    </div>
  );
};

export default TreeVisualizer;
