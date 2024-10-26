"use client";
import insertAVL from "@/utils/avlTree";
import insertBST from "@/utils/binarySearchTree";
import buildBinaryTree from "@/utils/binaryTree";
import insertHeap from "@/utils/heapTree";
import insertRedBlackTree from "@/utils/rbTree";
import { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";
import Konva from 'konva';
import { KonvaEventObject } from "konva/lib/Node";
import { HiMiniDevicePhoneMobile } from "react-icons/hi2";
import toast from "react-hot-toast";
import { MdTouchApp } from "react-icons/md";

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

interface Tree {
  heap: boolean;
  bst: boolean;
  avl: boolean;
  bt: boolean;
  rbt: boolean;
}


const TreeVisualizer: React.FC = () => {
    const stageRef = useRef<Konva.Stage | null>(null);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [treeWidth, setTreeWidth] = useState(0); // tracking tree-width for dynamic sizing
  const [inputValue, setInputValue] = useState("");
  const [binaryTree, setBinaryTree] = useState<Node | null>(null); // root node
  const [pressed, setPressed] = useState({
    bst: false,
    avl: false,
    heap: false,
    bt: false,
    rbt: false,
  });
  const [rotation, setRotation] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 }); // tracking stage position for panning 

  const startProcess = (tree:Tree) => {
    setPressed((prevPressed) => ({
      ...prevPressed,
       heap: tree.heap,
       bst: tree.bst,
       avl: tree.avl,
       bt: tree.bt,
       rbt: tree.rbt,
     }));
     const values = Array.from(new Set(inputValue.split(",").map((value) => parseInt(value.trim()))));
     
     if (values.some((value) => isNaN(value))) {
      toast.error("Not a number", {
        duration: 4000,
        position: "top-center",
      });
      return [];
    }
     return values
  }
  const resetHighlight = useCallback((node: Node | null) => {
    if (node) {
      node.highlight = false;
      resetHighlight(node.left);
      resetHighlight(node.right);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  // BST
  const handleBST = () => {
    const values = startProcess({
      heap: false,
      bst: true,
      avl: false,
      bt: false,
      rbt: false,
    });

    let newBinaryTree: Node | null = null;
    values.forEach((value) => {
      newBinaryTree = insertBST(newBinaryTree, value);
    });
    setBinaryTree(newBinaryTree);
  };
  // BT
  const handleBT = () => {
    const values = startProcess({
      heap: false,
      bst: false,
      avl: false,
      bt: true,
      rbt: false,
    });

    const newBinaryTree = buildBinaryTree(values);
    setBinaryTree(newBinaryTree);
  };

  // AVLT
  const handleAVLT = () => {
    const values = startProcess({
      heap: false,
      bst: false,
      avl: true,
      bt: false,
      rbt: false,
    });

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
  // HeapT
  const handleHeapT = () => {
    const values = startProcess({
      heap: true,
      bst: false,
      avl: false,
      bt: false,
      rbt: false,
    });

    let newHeapTree: Node[] = [];
    values.forEach((value) => {
      newHeapTree = insertHeap(newHeapTree, value);
    });
    setBinaryTree(buildBinaryTreeFromArray(newHeapTree));
  };
  const handleRBTree = () => {
    const values = startProcess({
      heap: false,
      bst: false,
      avl: false,
      bt: false,
      rbt: true,
    });
  
    let newRBTree: RBTreeNode | null = null;
    values.forEach((value) => {
      newRBTree = insertRedBlackTree(newRBTree, value);
    });
    if (newRBTree) {
      setBinaryTree(newRBTree);
    }
  };
   
  const calculateSubtreeWidth = (node: Node | null): number => {
    if (node === null) return 0;
    const leftWidth = calculateSubtreeWidth(node.left);
    const rightWidth = calculateSubtreeWidth(node.right);
    return leftWidth + rightWidth + 1;
  };
  // main drawing function
  const drawBinaryTree = useCallback(
    (
      node: Node | null,
      x: number,
      y: number,
      levelHeight: number,
      subtreeWidth: number
    ): JSX.Element[] => {
      if (!node) return [];
  
      node.x = x;
      node.y = y;
  
      const radius = 25 * zoomLevel;
      const elements = [];
  
      const nodeColor = (node as RBTreeNode).color === "R" ? "red" : "black";
  
      elements.push(
        <Circle
          key={`circle-${node.value}`}
          x={x}
          y={y}
          radius={radius}
          fill={node.highlight ? "#3ab1cf" : nodeColor}
          stroke="#3a9bf0"
          strokeWidth={2}
        />
      );
      elements.push(
        <Text
          key={`text-${node.value}`}
          text={node.value.toString()}
          x={x - 12 * zoomLevel}
          y={y - 10}
          fontSize={20 * zoomLevel}
          fill="white"
          scaleX={zoomLevel}
          scaleY={zoomLevel} 
        />
      );
  
      const leftSubtreeWidth = calculateSubtreeWidth(node.left);
      const rightSubtreeWidth = calculateSubtreeWidth(node.right);
  
      const maxSubtreeWidth = Math.max(leftSubtreeWidth, rightSubtreeWidth);
      const totalSubtreeWidth = maxSubtreeWidth * 2 + 1;
  
      if (node.left !== null) {
        // x-coordinate for the left child based on the maximum width
        const leftX = x - (subtreeWidth / totalSubtreeWidth) * maxSubtreeWidth * 50;
        const leftY = y + levelHeight;
  
        // Add a line from the parent node to the left child
        elements.push(
          <Line
            key={`line-left-${node.value}`}
            points={[x, y + radius, leftX, leftY]}
            stroke="#3a9bf0"
            strokeWidth={2}
          />
        );
  
        elements.push(
          ...drawBinaryTree(node.left, leftX, leftY, levelHeight, leftSubtreeWidth)
        );
      }
  
      if (node.right !== null) {
        // x-coordinate for the right child based on the maximum width
        const rightX = x + (subtreeWidth / totalSubtreeWidth) * maxSubtreeWidth * 50;
        const rightY = y + levelHeight;
  
        // Add the line from the parent node to the right child
        elements.push(
          <Line
            key={`line-right-${node.value}`}
            points={[x, y + radius, rightX, rightY]}
            stroke="#3a9bf0"
            strokeWidth={2}
          />
        );
  
        elements.push(
          ...drawBinaryTree(node.right, rightX, rightY, levelHeight, rightSubtreeWidth)
        );
      }
  
      return elements;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zoomLevel]
  );
  
  
  let lastDist = 0;

  const handleTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    if (e.evt.touches.length === 1) {
      // Panning
      const touch = e.evt.touches[0]; // native TouchEvent through e.evt
      const newPos = {
        x: touch.clientX - stagePos.x,
        y: touch.clientY - stagePos.y,
      };
      setStagePos(newPos);
      stage.position(newPos);
    }

    if (e.evt.touches.length === 2) {
      // pinch Zoom
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const dist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      if (!lastDist) {
        lastDist = dist;
      }

      const scaleBy = 0.01;
      const newScale = stage.scaleX() + (dist - lastDist) * scaleBy;
      setZoomLevel(newScale);

      stage.scale({ x: newScale, y: newScale });
      lastDist = dist;
    }
  };

  const handleTouchEnd = () => {
    lastDist = 0; // reset distance after pinch-zooming
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault(); // prevent default wheel behavior
    const stage = stageRef.current; 
    if (!stage) return;

    const oldScale = stage.scaleX(); 
    const pointer = stage.getPointerPosition(); 
    if (!pointer) {
        return; 
      }
    const scaleBy = 1.05; // zoom factor
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy; 

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setZoomLevel(newScale);
    setStagePos(newPos);

    stage.scale({ x: newScale, y: newScale }); 
    stage.position(newPos);
  };

  const calculateCanvasSize = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const width = Math.max(windowWidth, treeWidth)/2; 
    const height = windowHeight;  
    setCanvasSize({ width, height });
  }, [treeWidth]);

  useEffect(() => {
    if (binaryTree) {
      const totalWidth = calculateSubtreeWidth(binaryTree) * 50 * zoomLevel; // Adjust the width by zoomLevel
      setTreeWidth(totalWidth);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binaryTree, zoomLevel]);

  useEffect(() => {
    calculateCanvasSize();
    window.addEventListener("resize", calculateCanvasSize); 
    return () => window.removeEventListener("resize", calculateCanvasSize);
  }, [calculateCanvasSize]);

  return (
    <div className="flex flex-col">
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
              onClick={handleBT}
              className={`${
                pressed.bt ? "bg-teal-600" : "bg-blue-500"
              }  button p-2 min-w-fit h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 ${pressed.bt && "translate-y-2"} ${
                !pressed.bt &&
                "[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]"
              }
            border-b-[1px] border-blue-400`}
            >
              <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
                Binary Tree
              </span>
            </div>
            <div
              onClick={handleBST}
              className={`${
                pressed.bst ? "bg-teal-600" : "bg-blue-500"
              } button p-2 min-w-fit h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2 active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 ${pressed.bst && "translate-y-2"} ${
                !pressed.bst &&
                "[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]"
              }
            border-b-[1px] border-blue-400`}
            >
              <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg">
                Binary Search Tree
              </span>
            </div>
            <div
              onClick={handleAVLT}
              className={`${
                pressed.avl ? "bg-teal-600" : "bg-blue-500"
              }  button p-2 min-w-fit h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 ${pressed.avl && "translate-y-2"} ${
                !pressed.avl &&
                "[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]"
              }
            border-b-[1px] border-blue-400`}
            >
              <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
                Avl Tree
              </span>
            </div>
            <div
            onClick={handleHeapT}
            className={`${
              pressed.heap ? "bg-teal-600" : "bg-blue-500"
            }  button p-2 min-w-fit h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px] 
            transition-all duration-150 ${pressed.heap && 'translate-y-2'} ${!pressed.heap && '[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]'}
            border-b-[1px] border-blue-400`}
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              Heap Tree
            </span>
          </div>
          <div
            onClick={handleRBTree}
            className={`${
              pressed.rbt ? "bg-teal-600" : "bg-blue-500"
            }  button mt-2 p-2 min-w-fit h-10 rounded-lg cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px]
            transition-all duration-150 ${pressed.rbt && 'translate-y-2'} ${!pressed.rbt && '[box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]'}
            border-b-[1px] border-blue-400`}
          >
            <span className="flex flex-col justify-center items-center h-full text-white font-bold text-lg ">
              Red Black Tree
            </span>
          </div>
          </div>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <button
              onClick={() => setRotation(rotation === 0 ? 90 : 0)}
              className="button min-w-fit h-10 bg-rose-500 rounded-lg cursor-pointer select-none active:translate-y-2 transition-all duration-150 p-2"
            >
              <span className="flex justify-center items-center h-full text-white font-bold text-sm">
                <span className="pr-2">Rotate for mobile view </span>
                <span>
                  <HiMiniDevicePhoneMobile className="w-5 h-5" />
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <div
        className="mt-8 md:ml-10 lg:ml-20 overflow-hidden border-2 rounded-lg border-sky-600 sm:-ml-2"
        style={{
          width:
            window.innerWidth > 768
              ? `${Math.max(treeWidth, canvasSize.width)}px`
              : "100%",
          height: `calc(100vh - 10px)`,
        }}
      >
        <span className="flex justify-end gap-1 items-end p-1 bg-gradient-to-b from-slate-300 select-none">
          <span><MdTouchApp className="w-6 h-6 text-gray-700" /></span>
          <span className="font-bold text-gray-700 text-sm">Drag to move</span>
        </span>
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          draggable
          scaleX={zoomLevel}
          scaleY={zoomLevel}
          x={stagePos.x}
          y={stagePos.y}
          onWheel={handleWheel}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          rotation={window.innerWidth <= 768 ? rotation : 0}
          offsetX={
            window.innerWidth <= 768 && rotation ? canvasSize.width / 2 : 0
          } // Center the stage when rotated
          offsetY={
            window.innerWidth <= 768 && rotation ? canvasSize.height / 2 : 0
          } // Center the stage when rotated
        >
          <Layer>
            {binaryTree &&
              drawBinaryTree(
                binaryTree,
                canvasSize.width / 2,
                50,
                80,
                calculateSubtreeWidth(binaryTree)
              )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default TreeVisualizer;
