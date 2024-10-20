import dynamic from 'next/dynamic';
import React from 'react';
import { TbBinaryTree } from "react-icons/tb";
import GithubLogs from '@/components/GithubLogs'

const TreeVisualizer = dynamic(() => import('@/components/TreeVisualizer'), {
  ssr: false,
});

const HomePage: React.FC = () => {
  return (
    <div className='flex gap-4'>
    <div className='bg-blue-300 w-1/3'>
      <GithubLogs/> 
    </div>
    <div className="text-center p-2 sm:p-2 lg:pl-8 lg:pr-8 w-2/3">
      <h1 className="text-sky-600 text-2xl sm:text-3xl lg:text-4xl font-bold p-2 flex justify-center items-center gap-2">
        <span ><TbBinaryTree className='w-12 h-12'/></span>
        <span>Tree Visualizer</span>
      </h1>
      <TreeVisualizer />
      </div>
    </div>
  );
};

export default HomePage;
