
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebsiteCloner } from '@/utils/cloner';
import { CloneOptions, CloneProgress } from '@/utils/interfaces';
import Header from '@/components/Header';
import CloneForm from '@/components/CloneForm';
import ProcessIndicator from '@/components/ProcessIndicator';
import LogDisplay from '@/components/LogDisplay';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [cloner] = useState(() => new WebsiteCloner());
  const [progress, setProgress] = useState<CloneProgress>(cloner.getProgress());
  
  const startCloning = async (options: CloneOptions) => {
    try {
      await cloner.startClone(options);
      toast.success('Clone completed successfully!');
    } catch (error) {
      toast.error(`Clone failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const cancelCloning = () => {
    cloner.cancelClone();
    toast.info('Clone operation cancelled');
  };
  
  // Update progress state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(cloner.getProgress());
    }, 100);
    
    return () => clearInterval(interval);
  }, [cloner]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {/* Background blur spheres (decorative) */}
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
      
      <Header />
      
      <main className="container max-w-5xl px-4 pt-8 pb-16">
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
        
        <CloneForm 
          onStartClone={startCloning} 
          isCloning={progress.status === 'running'} 
        />
        
        <AnimatePresence>
          {progress.status !== 'idle' && (
            <ProcessIndicator progress={progress} onCancel={cancelCloning} />
          )}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6"
        >
          <LogDisplay logs={progress.logs} />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
