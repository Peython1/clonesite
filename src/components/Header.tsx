
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Code, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full py-4 px-6 glass glass-border sticky top-0 z-50 flex items-center justify-between"
    >
      <motion.div 
        className="flex items-center space-x-3"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="bg-primary/10 p-2 rounded-full">
          <Globe className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-medium">Website Cloner</h1>
          <p className="text-xs text-muted-foreground">Educational Archive Tool</p>
        </div>
      </motion.div>
      
      <div className="flex items-center space-x-2">
        <motion.a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
            "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
            "transition-colors duration-200"
          )}
        >
          <Code className="h-4 w-4" />
          <span>Source</span>
        </motion.a>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
            "bg-primary/10 hover:bg-primary/20 text-primary",
            "transition-colors duration-200"
          )}
        >
          <Info className="h-4 w-4" />
          <span>About</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
