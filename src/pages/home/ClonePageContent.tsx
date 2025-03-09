import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WebsiteCloner } from '@/utils/cloner';
import { CloneOptions, CloneProgress, MatrixConfig } from '@/utils/interfaces';
import { toast } from '@/hooks/use-toast';

import Header from '@/components/Header';
import CloneForm from '@/components/CloneForm';
import ProcessIndicator from '@/components/ProcessIndicator';
import LogDisplay from '@/components/LogDisplay';
import MatrixController from '@/components/matrix/MatrixController';

import PageHeader from './components/PageHeader';
import BackgroundEffects from './components/BackgroundEffects';
import AdvancedOptions from './components/AdvancedOptions';

const ClonePageContent: React.FC = () => {
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
  
  const [bandwidthSaverEnabled, setBandwidthSaverEnabled] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(5); // in MB
  const [compressResources, setCompressResources] = useState(true);
  
  const handleResourceTypesChange = (resourceTypes: CloneOptions['resourceTypes']) => {
    setCloneOptions(prev => ({
      ...prev,
      resourceTypes
    }));
  };
  
  const handleLoadProfile = (options: CloneOptions) => {
    setCloneOptions(options);
  };
  
  const startCloning = async (formOptions: Partial<CloneOptions>) => {
    try {
      const mergedOptions: CloneOptions = {
        ...cloneOptions,
        ...formOptions,
        ...(bandwidthSaverEnabled && {
          maxFileSize: maxFileSize * 1024 * 1024,
          compressResources
        })
      };
      
      setCloneOptions(mergedOptions);
      
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
  
  const toggleMatrixEffect = () => {
    setMatrixConfig(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
    
    toast({
      title: matrixConfig.enabled ? "Matrix Effect Disabled" : "Matrix Effect Enabled",
      description: matrixConfig.enabled 
        ? "The matrix rain effect has been turned off." 
        : "The matrix rain effect has been turned on.",
      variant: "default",
    });
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(cloner.getProgress());
    }, 100);
    
    return () => clearInterval(interval);
  }, [cloner]);
  
  return (
    <div className="min-h-screen bg-background relative">
      <MatrixController config={matrixConfig} onChange={setMatrixConfig} />
      
      <BackgroundEffects 
        isMatrixEnabled={matrixConfig.enabled}
        onToggleMatrix={toggleMatrixEffect} 
      />
      
      <Header />
      
      <main className="container max-w-5xl px-4 pt-8 pb-16">
        <PageHeader />
        
        <AdvancedOptions
          cloneOptions={cloneOptions}
          onResourceTypesChange={handleResourceTypesChange}
          onLoadProfile={handleLoadProfile}
          bandwidthSaverEnabled={bandwidthSaverEnabled}
          onBandwidthSaverEnabledChange={setBandwidthSaverEnabled}
          maxFileSize={maxFileSize}
          onMaxFileSizeChange={setMaxFileSize}
          compressResources={compressResources}
          onCompressResourcesChange={setCompressResources}
        />
        
        <CloneForm 
          onStartClone={startCloning} 
          isCloning={progress.status === 'running'} 
        />
        
        <AnimatePresence>
          {progress.status !== 'idle' && (
            <ProcessIndicator progress={progress} onCancel={cancelCloning} />
          )}
        </AnimatePresence>
        
        <LogDisplay logs={progress.logs} className="mt-6" />
      </main>
    </div>
  );
};

export default ClonePageContent;
