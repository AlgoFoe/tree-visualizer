import TreeVisualizer from '@/components/TreeVisualizer';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="text-center p-4 sm:p-6 lg:p-8">
      <h1 className='text-sky-600 text-2xl sm:text-3xl lg:text-4xl font-bold p-2'>Tree Visualizer</h1>
      <TreeVisualizer />
    </div>
  );
};

export default HomePage;
