import React, { useState } from 'react';
import { MatrixConfig } from '@/utils/interfaces';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { 
  Slider 
} from '@/components/ui/slider';
import {
  Switch
} from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2Icon } from 'lucide-react';

interface MatrixConfigPanelProps {
  config: MatrixConfig;
  onChange: (config: MatrixConfig) => void;
}

const MatrixConfigPanel: React.FC<MatrixConfigPanelProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleChange = (key: keyof MatrixConfig, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };
  
  // Predefined matrix colors
  const predefinedColors = [
    { value: '#00FF00', label: 'Matrix Green' },
    { value: '#0088FF', label: 'Cyber Blue' },
    { value: '#FF00FF', label: 'Neon Purple' },
    { value: '#FFFF00', label: 'Bright Yellow' },
    { value: '#FF0000', label: 'Red Alert' },
    { value: '#00FFFF', label: 'Digital Cyan' },
    { value: '#FFFFFF', label: 'Ghost White' },
  ];
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          title="Matrix Effect Settings"
        >
          <Settings2Icon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Matrix Rain Settings</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="matrixEnabled">Enable Effect</Label>
            <Switch
              id="matrixEnabled"
              checked={config.enabled}
              onCheckedChange={(checked) => handleChange('enabled', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="opacity">Opacity</Label>
              <span className="text-xs text-muted-foreground">{Math.round(config.opacity * 100)}%</span>
            </div>
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.01}
              value={[config.opacity]}
              onValueChange={(value) => handleChange('opacity', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="speed">Speed</Label>
              <span className="text-xs text-muted-foreground">{config.speed.toFixed(1)}x</span>
            </div>
            <Slider
              id="speed"
              min={0.1}
              max={5}
              step={0.1}
              value={[config.speed]}
              onValueChange={(value) => handleChange('speed', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="density">Density</Label>
              <span className="text-xs text-muted-foreground">{Math.round(config.density * 100)}%</span>
            </div>
            <Slider
              id="density"
              min={0.01}
              max={0.5}
              step={0.01}
              value={[config.density]}
              onValueChange={(value) => handleChange('density', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex space-x-2">
              <Select
                value={predefinedColors.find(c => c.value === config.color)?.value || 'custom'}
                onValueChange={(value) => handleChange('color', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 mr-2 rounded-full" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Color</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="color"
                value={config.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-12 p-1 h-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fps">FPS Limit</Label>
              <span className="text-xs text-muted-foreground">
                {config.fps || 30} FPS
              </span>
            </div>
            <Slider
              id="fps"
              min={10}
              max={60}
              step={5}
              value={[config.fps || 30]}
              onValueChange={(value) => handleChange('fps', value[0])}
            />
          </div>
          
          <div className="pt-2 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                handleChange('enabled', true);
                handleChange('opacity', 0.2);
                handleChange('speed', 1.5);
                handleChange('density', 0.1);
                handleChange('color', '#00FF00');
                handleChange('fps', 30);
              }}
            >
              Reset Defaults
            </Button>
            
            <Button 
              variant="default"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MatrixConfigPanel;
