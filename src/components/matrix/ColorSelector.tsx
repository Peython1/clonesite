
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Predefined matrix colors
export const predefinedColors = [
  { value: '#00FF00', label: 'Matrix Green' },
  { value: '#0088FF', label: 'Cyber Blue' },
  { value: '#FF00FF', label: 'Neon Purple' },
  { value: '#FFFF00', label: 'Bright Yellow' },
  { value: '#FF0000', label: 'Red Alert' },
  { value: '#00FFFF', label: 'Digital Cyan' },
  { value: '#FFFFFF', label: 'Ghost White' },
];

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="color">Color</Label>
      <div className="flex space-x-2">
        <Select
          value={predefinedColors.find(c => c.value === value)?.value || 'custom'}
          onValueChange={onChange}
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 p-1 h-10"
        />
      </div>
    </div>
  );
};

export default ColorSelector;
