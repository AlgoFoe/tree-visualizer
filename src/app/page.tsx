import dynamic from 'next/dynamic';
import React from 'react';
import { TbBinaryTree } from "react-icons/tb";

const TreeVisualizer = dynamic(() => import('@/components/TreeVisualizer'), {
  ssr: false,
});

const HomePage: React.FC = () => {
  return (
    <div className="text-center p-4 sm:p-6 lg:p-8">
      <h1 className="text-sky-600 text-2xl sm:text-3xl lg:text-4xl font-bold p-2 flex justify-center items-center gap-2">
        <span ><TbBinaryTree className='w-12 h-12'/></span>
        <span>Tree Visualizer</span>
      </h1>
      <TreeVisualizer />
    </div>
  );
};

export default HomePage;
