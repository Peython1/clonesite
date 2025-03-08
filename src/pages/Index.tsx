
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebsiteCloner } from '@/utils/cloner';
import { CloneOptions, CloneProgress, MatrixConfig } from '@/utils/interfaces';
import Header from '@/components/Header';
import CloneForm from '@/components/CloneForm';
import ProcessIndicator from '@/components/ProcessIndicator';
import LogDisplay from '@/components/LogDisplay';
import { toast } from '@/hooks/use-toast';
import MatrixRain from '@/components/MatrixRain';
import MatrixConfigPanel from '@/components/MatrixConfigPanel';
import ResourceSelector from '@/components/ResourceSelector';
import ConfigProfiles from '@/components/ConfigProfiles';
import BandwidthSaver from '@/components/BandwidthSaver';

const Index = () => {
  const [cloner] = useState(() => new WebsiteCloner());
  const [progress, setProgress] = useState<CloneProgress>(cloner.getProgress());
  const [matrixConfig, setMatrixConfig] = useState<MatrixConfig>({
    enabled: true,
    opacity: 0.2,
    speed: 1.5,
    color: '#00FF00',
    density: 0.1,
    fps: 30
  });
  
  // Clone options state
  const [cloneOptions, setCloneOptions] = useState<CloneOptions>({
    url: '',
    outputDir: '',
    maxDepth: 2,
    sameHostOnly: true,
    resourceTypes: {
      html: true,
      css: true,
      js: true,
      images: true,
      fonts: true,
      videos: true,
      documents: true,
      other: true
    }
  });
  
  // Bandwidth saver state
  const [bandwidthSaverEnabled, setBandwidthSaverEnabled] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(5); // in MB
  const [compressResources, setCompressResources] = useState(true);
  
  // Update resource types
  const handleResourceTypesChange = (resourceTypes: CloneOptions['resourceTypes']) => {
    setCloneOptions(prev => ({
      ...prev,
      resourceTypes
    }));
  };
  
  // Load a saved profile
  const handleLoadProfile = (options: CloneOptions) => {
    setCloneOptions(options);
  };
  
  const startCloning = async (formOptions: Partial<CloneOptions>) => {
    try {
      // Merge form options with current options
      const mergedOptions: CloneOptions = {
        ...cloneOptions,
        ...formOptions,
        // Apply bandwidth saving options if enabled
        ...(bandwidthSaverEnabled && {
          maxFileSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
          compressResources
        })
      };
      
      // Update the full options state
      setCloneOptions(mergedOptions);
      
      // Start the clone operation
      await cloner.startClone(mergedOptions);
      
      toast({
        title: "Success",
        description: "Clone completed successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Clone failed: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    }
  };
  
  const cancelCloning = () => {
    cloner.cancelClone();
    toast({
      title: "Info",
      description: "Clone operation cancelled",
    });
  };
  
  // Update progress state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(cloner.getProgress());
    }, 100);
    
    return () => clearInterval(interval);
  }, [cloner]);
  
  // Expose matrix controls globally
  useEffect(() => {
    // Add configuration API
    if (window) {
      (window as any).configureMatrixEffect = (config: Partial<MatrixConfig>) => {
        setMatrixConfig(prev => ({
          ...prev,
          ...config
        }));
      };
      
      // Start/stop methods
      (window as any).startMatrixEffect = () => {
        setMatrixConfig(prev => ({
          ...prev,
          enabled: true
        }));
      };
      
      (window as any).stopMatrixEffect = () => {
        setMatrixConfig(prev => ({
          ...prev,
          enabled: false
        }));
      };
    }
    
    // Check for epilepsy setting in localStorage
    const epilepsySafe = localStorage.getItem('epilepsySafe') === 'true';
    if (epilepsySafe) {
      setMatrixConfig(prev => ({
        ...prev,
        enabled: false
      }));
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Matrix Rain Effect */}
      <MatrixRain 
        enabled={matrixConfig.enabled}
        opacity={matrixConfig.opacity}
        speed={matrixConfig.speed}
        color={matrixConfig.color}
        density={matrixConfig.density}
      />
      
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
      
      <div className="absolute top-3 right-3 z-10">
        <MatrixConfigPanel 
          config={matrixConfig}
          onChange={setMatrixConfig}
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
        
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Advanced Options</h2>
            <ConfigProfiles 
              currentConfig={cloneOptions}
              onLoadProfile={handleLoadProfile}
            />
          </div>
          
          <div className="space-y-4">
            <ResourceSelector 
              value={cloneOptions.resourceTypes || {
                html: true,
                css: true,
                js: true,
                images: true,
                fonts: true,
                videos: true,
                documents: true,
                other: true
              }}
              onChange={handleResourceTypesChange}
            />
            
            <div className="h-px bg-border my-4" />
            
            <BandwidthSaver 
              enabled={bandwidthSaverEnabled}
              onEnabledChange={setBandwidthSaverEnabled}
              maxFileSize={maxFileSize}
              onMaxFileSizeChange={setMaxFileSize}
              compressResources={compressResources}
              onCompressResourcesChange={setCompressResources}
            />
          </div>
        </div>
        
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
