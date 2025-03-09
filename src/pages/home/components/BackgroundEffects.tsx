
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-20 left-[10%] w-[30rem] h-[30rem] rounded-full bg-blue-300/20 blur-3xl -z-10"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute top-40 right-[15%] w-[25rem] h-[25rem] rounded-full bg-purple-300/20 blur-3xl -z-10"
      />
    </div>
  );
};

export default BackgroundEffects;
