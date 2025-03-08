
import React from 'react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { WifiOffIcon } from 'lucide-react';

interface BandwidthSaverProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  maxFileSize: number;
  onMaxFileSizeChange: (size: number) => void;
  compressResources: boolean;
  onCompressResourcesChange: (compress: boolean) => void;
}

const BandwidthSaver: React.FC<BandwidthSaverProps> = ({
  enabled,
  onEnabledChange,
  maxFileSize,
  onMaxFileSizeChange,
  compressResources,
  onCompressResourcesChange
}) => {
  const [open, setOpen] = React.useState(false);
  
  // Convert MB to bytes for display
  const formatFileSize = (mb: number) => {
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
    return `${mb.toFixed(1)} MB`;
  };
  
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <div className="flex items-center space-x-2">
        <Switch
          id="bandwidth-mode"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
        <div className="flex flex-col space-y-0.5">
          <Label htmlFor="bandwidth-mode">Bandwidth Saving Mode</Label>
          <CollapsibleTrigger asChild>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
              <span>Configure options</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ml-1 h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent className="space-y-3 mt-3">
        <div className="flex items-center">
          <WifiOffIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Bandwidth saving mode helps reduce data usage by limiting file sizes and optionally compressing resources.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="max-file-size">Maximum File Size</Label>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(maxFileSize)}
            </span>
          </div>
          <Slider
            id="max-file-size"
            min={0.1}
            max={50}
            step={0.1}
            value={[maxFileSize]}
            onValueChange={(value) => onMaxFileSizeChange(value[0])}
            disabled={!enabled}
          />
          <p className="text-xs text-muted-foreground">
            Files larger than this size will be skipped during cloning.
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="compress-resources">Compress Resources</Label>
          <Switch
            id="compress-resources"
            checked={compressResources}
            onCheckedChange={onCompressResourcesChange}
            disabled={!enabled}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          When enabled, HTML, CSS and JavaScript files will be minified to reduce their size.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BandwidthSaver;
