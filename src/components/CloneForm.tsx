
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloneOptions } from '@/utils/interfaces';
import { 
  Link2, FolderOutput, Settings, 
  Layers, Workflow, ExternalLink, Info 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CloneFormProps {
  onStartClone: (options: CloneOptions) => void;
  isCloning: boolean;
}

const CloneForm: React.FC<CloneFormProps> = ({ onStartClone, isCloning }) => {
  const [url, setUrl] = useState<string>('');
  const [outputPath, setOutputPath] = useState<string>('./archive');
  const [depth, setDepth] = useState<number>(0); // 0 means unlimited
  const [includeExternal, setIncludeExternal] = useState<boolean>(true);
  const [parallel, setParallel] = useState<number>(10);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    onStartClone({
      url,
      outputPath,
      depth,
      includeExternal,
      parallel
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-card rounded-xl shadow-elevated p-6 backdrop-blur-sm border">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="url" className="flex items-center text-sm font-medium text-muted-foreground">
              <Link2 className="h-4 w-4 mr-1.5" />
              Website URL
            </label>
            <div className="relative">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="pr-16"
                disabled={isCloning}
                required
              />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: url ? 1 : 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {url && (
                  <a 
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline flex items-center"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                )}
              </motion.div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="outputPath" className="flex items-center text-sm font-medium text-muted-foreground">
              <FolderOutput className="h-4 w-4 mr-1.5" />
              Output Directory
            </label>
            <Input
              id="outputPath"
              value={outputPath}
              onChange={(e) => setOutputPath(e.target.value)}
              placeholder="./archive"
              disabled={isCloning}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="flex items-center text-sm font-medium text-muted-foreground">
                <Layers className="h-4 w-4 mr-1.5" />
                Recursion Depth
              </label>
              <div className="flex items-center">
                <div className="flex-1 mr-4">
                  <Slider
                    value={[depth]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(value) => setDepth(value[0])}
                    disabled={isCloning}
                  />
                </div>
                <div className="w-12 text-center text-sm font-medium">
                  {depth === 0 ? "∞" : depth}
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <label className="flex items-center text-sm font-medium text-muted-foreground">
                <Workflow className="h-4 w-4 mr-1.5" />
                Parallel Downloads
              </label>
              <div className="flex items-center">
                <div className="flex-1 mr-4">
                  <Slider
                    value={[parallel]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setParallel(value[0])}
                    disabled={isCloning}
                  />
                </div>
                <div className="w-12 text-center text-sm font-medium">
                  {parallel}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="external"
                checked={includeExternal}
                onCheckedChange={setIncludeExternal}
                disabled={isCloning}
              />
              <label 
                htmlFor="external" 
                className="text-sm font-medium cursor-pointer flex items-center"
              >
                <span>Include external resources</span>
                <Popover>
                  <PopoverTrigger>
                    <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <p className="text-xs text-muted-foreground">
                      When enabled, resources from external domains will also be downloaded.
                    </p>
                  </PopoverContent>
                </Popover>
              </label>
            </div>
            
            <div className="flex gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isCloning}>
                    <Settings className="h-4 w-4 mr-1.5" />
                    <span>Advanced</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Advanced Options</h3>
                    <p className="text-xs text-muted-foreground">
                      Additional options will be available in future updates.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                type="submit"
                disabled={isCloning || !url}
                className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  "bg-primary hover:bg-primary/90"
                )}
              >
                <span>Start Cloning</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          <strong>Disclaimer:</strong> This tool is for educational purposes only. 
          Only use on websites with open licenses or with explicit permission.
        </p>
      </div>
    </motion.div>
  );
};

export default CloneForm;
