
import React from 'react';
import { motion } from 'framer-motion';

const PageHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center mb-10"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4"
      >
        Educational Archive Tool
      </motion.div>
      
      <h1 className="text-4xl font-bold mb-3 text-balance">
        Website Cloner for Educational Study
      </h1>
      
      <p className="text-muted-foreground text-balance max-w-xl mx-auto">
        Clone websites for offline study and analysis. This tool downloads HTML, CSS, JS, 
        and media assets to create a local archive for educational purposes.
      </p>
    </motion.div>
  );
};

export default PageHeader;
