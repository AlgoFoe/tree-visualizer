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
  const [inputValue, setInputValue] = useState("");
  const [binaryTree, setBinaryTree] = useState<Node | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const drawBinaryTree = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      node: Node | null,
      x: number,
      y: number,
      dx: number,
      dy: number
    ) => {
      if (node === null) return;
      node.x = x;
      node.y = y;

      const radius = 25;
      const centerX = x + radius;
      const centerY = y + radius;

      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.fillStyle = "#FFA500";
      ctx.strokeStyle = "green";

      if (node.highlight) ctx.fillStyle = "#3ab1cf";

      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.font = "20px Verdana";
      ctx.fillText(node.value.toString(), centerX - 12, centerY);

      if (node.left !== null) {
        const leftX = x - dx + radius;
        const leftY = y + dy;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY + radius);
        ctx.lineTo(leftX, leftY);

        if (node.left.highlight) ctx.strokeStyle = "#3ab1cf";
        ctx.stroke();

        drawBinaryTree(ctx, node.left, x - dx, y + dy, dx / 2, dy);
      }

      if (node.right !== null) {
        const rightX = x + dx + radius;
        const rightY = y + dy;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY + radius);
        ctx.lineTo(rightX, rightY);
        if (node.right.highlight) ctx.strokeStyle = "#3ab1cf";
        ctx.stroke();

        drawBinaryTree(ctx, node.right, x + dx, y + dy, dx / 2, dy);
      }
    },
    []
  );

  // const redrawBinaryTree = useCallback(() => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const ctx = canvas.getContext("2d");
  //     if (ctx) {
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       drawBinaryTree(ctx, binaryTree, canvas.width / 2, 50, 90, 100);
  //     }
  //   }
  // }, [binaryTree, drawBinaryTree]);
  const redrawBinaryTree = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save(); 
        ctx.setTransform(zoomLevel, 0, 0, zoomLevel, canvas.width / 2 * (1 - zoomLevel), -canvas.height / 2 * (1 - zoomLevel)); 
        drawBinaryTree(ctx, binaryTree, canvas.width / 2, 50, 80, 80);
        ctx.restore(); 
      }
    }
  }, [binaryTree, drawBinaryTree, zoomLevel]);
  

  useEffect(() => {
    redrawBinaryTree();
  }, [binaryTree, redrawBinaryTree]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 150;
        redrawBinaryTree();
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [redrawBinaryTree]);

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
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 2)); // Limit max zoom level
  };
  
  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 0.5)); // Limit min zoom level
  };
  
  
  return (
    <div className="App flex flex-col items-center p-4">
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
            className="button w-16 h-10 bg-blue-500 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
            border-b-[1px] border-blue-400"
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              BST
            </span>
          </div>
          <div
            onClick={handleBT}
            className="button w-16 h-10 bg-blue-500 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
            border-b-[1px] border-blue-400"
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              BT
            </span>
          </div>
          <div
            onClick={handleAVLT}
            className="button w-16 h-10 bg-blue-500 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
            border-b-[1px] border-blue-400"
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              AVL T
            </span>
          </div>
          <div
            onClick={handleHeapT}
            className="button w-16 h-10 bg-blue-500 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
            border-b-[1px] border-blue-400"
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              Heap T
            </span>
          </div>
        </div>
        <div className="flex gap-2 justify-center mt-2 flex-wrap">
          <button className="p-2 bg-gray-600 rounded-md" onClick={handleZoomIn}>
            Zoom In
          </button>
          <button className="p-2 bg-gray-600 rounded-md" onClick={handleZoomOut}>
            Zoom Out
          </button>
        </div>

        <canvas className="mr-5 mb-5 mt-5 -ml-4 max-w-full" ref={canvasRef} />
      </div>
    </div>
  );
};

export default TreeVisualizer;
