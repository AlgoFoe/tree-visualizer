type Node = {
    value: number;
    left: Node | null;
    right: Node | null;
    x: number;
    y: number;
    highlight: boolean;
  };
const insertHeap = (heap: Node[], value: number): Node[] => {
    heap.push({
      value,
      left: null,
      right: null,
      x: 0,
      y: 0,
      highlight: false
    });
  
    let index = heap.length - 1;
    let parentIndex = Math.floor((index - 1) / 2);
  
    while (index > 0 && heap[parentIndex].value < heap[index].value) {
      [heap[parentIndex], heap[index]] = [heap[index], heap[parentIndex]];
  
      index = parentIndex;
      parentIndex = Math.floor((index - 1) / 2);
    }
  
    return heap;
  };
  
  export default insertHeap;