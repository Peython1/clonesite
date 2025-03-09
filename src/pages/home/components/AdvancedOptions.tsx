
import React from 'react';
import { CloneOptions } from '@/utils/interfaces';
import ResourceSelector from '@/components/ResourceSelector';
import BandwidthSaver from '@/components/BandwidthSaver';
import ConfigProfiles from '@/components/ConfigProfiles';

interface AdvancedOptionsProps {
  cloneOptions: CloneOptions;
  onResourceTypesChange: (resourceTypes: CloneOptions['resourceTypes']) => void;
  onLoadProfile: (options: CloneOptions) => void;
  bandwidthSaverEnabled: boolean;
  onBandwidthSaverEnabledChange: (enabled: boolean) => void;
  maxFileSize: number;
  onMaxFileSizeChange: (size: number) => void;
  compressResources: boolean;
  onCompressResourcesChange: (compress: boolean) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  cloneOptions,
  onResourceTypesChange,
  onLoadProfile,
  bandwidthSaverEnabled,
  onBandwidthSaverEnabledChange,
  maxFileSize,
  onMaxFileSizeChange,
  compressResources,
  onCompressResourcesChange
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Advanced Options</h2>
        <ConfigProfiles 
          currentConfig={cloneOptions}
          onLoadProfile={onLoadProfile}
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
          onChange={onResourceTypesChange}
        />
        
        <div className="h-px bg-border my-4" />
        
        <BandwidthSaver 
          enabled={bandwidthSaverEnabled}
          onEnabledChange={onBandwidthSaverEnabledChange}
          maxFileSize={maxFileSize}
          onMaxFileSizeChange={onMaxFileSizeChange}
          compressResources={compressResources}
          onCompressResourcesChange={onCompressResourcesChange}
        />
      </div>
    </div>
  );
};

export default AdvancedOptions;
