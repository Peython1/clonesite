
import { useState } from 'react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileIcon, ImageIcon, FileTextIcon, CodeIcon, FileTypeIcon, VideoIcon, FontIcon, MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceSelectorProps {
  value: {
    html: boolean;
    css: boolean;
    js: boolean;
    images: boolean;
    fonts: boolean;
    videos: boolean;
    documents: boolean;
    other: boolean;
  };
  onChange: (resources: ResourceSelectorProps['value']) => void;
}

const ResourceSelector = ({ value, onChange }: ResourceSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  const updateResource = (key: keyof typeof value) => (checked: boolean) => {
    onChange({
      ...value,
      [key]: checked
    });
  };
  
  const selectAll = () => {
    onChange({
      html: true,
      css: true,
      js: true,
      images: true,
      fonts: true,
      videos: true,
      documents: true,
      other: true
    });
  };
  
  const selectNone = () => {
    onChange({
      html: false,
      css: false,
      js: false,
      images: false,
      fonts: false,
      videos: false,
      documents: false,
      other: false
    });
  };
  
  // Count selected resources
  const selectedCount = Object.values(value).filter(Boolean).length;
  
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <span>Resource Types ({selectedCount}/8)</span>
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
              className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="html" 
              checked={value.html}
              onCheckedChange={(checked) => updateResource('html')(!!checked)}
            />
            <Label htmlFor="html" className="flex items-center cursor-pointer">
              <FileTextIcon className="h-4 w-4 mr-2 text-blue-500" />
              HTML Files
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="css" 
              checked={value.css}
              onCheckedChange={(checked) => updateResource('css')(!!checked)}
            />
            <Label htmlFor="css" className="flex items-center cursor-pointer">
              <CodeIcon className="h-4 w-4 mr-2 text-purple-500" />
              CSS Stylesheets
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="js" 
              checked={value.js}
              onCheckedChange={(checked) => updateResource('js')(!!checked)}
            />
            <Label htmlFor="js" className="flex items-center cursor-pointer">
              <FileIcon className="h-4 w-4 mr-2 text-yellow-500" />
              JavaScript Files
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="images" 
              checked={value.images}
              onCheckedChange={(checked) => updateResource('images')(!!checked)}
            />
            <Label htmlFor="images" className="flex items-center cursor-pointer">
              <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
              Images (JPG, PNG, etc.)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fonts" 
              checked={value.fonts}
              onCheckedChange={(checked) => updateResource('fonts')(!!checked)}
            />
            <Label htmlFor="fonts" className="flex items-center cursor-pointer">
              <FontIcon className="h-4 w-4 mr-2 text-indigo-500" />
              Fonts (WOFF, TTF, etc.)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="videos" 
              checked={value.videos}
              onCheckedChange={(checked) => updateResource('videos')(!!checked)}
            />
            <Label htmlFor="videos" className="flex items-center cursor-pointer">
              <VideoIcon className="h-4 w-4 mr-2 text-red-500" />
              Video Files (MP4, WebM, etc.)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="documents" 
              checked={value.documents}
              onCheckedChange={(checked) => updateResource('documents')(!!checked)}
            />
            <Label htmlFor="documents" className="flex items-center cursor-pointer">
              <FileTypeIcon className="h-4 w-4 mr-2 text-orange-500" />
              Documents (PDF, DOC, etc.)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="other" 
              checked={value.other}
              onCheckedChange={(checked) => updateResource('other')(!!checked)}
            />
            <Label htmlFor="other" className="flex items-center cursor-pointer">
              <MoreHorizontalIcon className="h-4 w-4 mr-2 text-gray-500" />
              Other Resource Types
            </Label>
          </div>
        </div>
        
        <div className="flex justify-between mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAll}
            className="text-xs"
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectNone}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ResourceSelector;
