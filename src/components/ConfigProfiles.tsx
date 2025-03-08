
import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { SaveIcon, FolderIcon, TrashIcon, PlusCircleIcon } from 'lucide-react';
import { CloneOptions } from '@/utils/interfaces';
import { toast } from '@/hooks/use-toast';

interface ConfigProfile {
  id: string;
  name: string;
  options: CloneOptions;
  createdAt: number;
}

interface ConfigProfilesProps {
  currentConfig: CloneOptions;
  onLoadProfile: (options: CloneOptions) => void;
}

const ConfigProfiles: React.FC<ConfigProfilesProps> = ({ 
  currentConfig, 
  onLoadProfile 
}) => {
  const [profiles, setProfiles] = useState<ConfigProfile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  
  // Load profiles from localStorage on component mount
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('cloneConfigProfiles');
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  }, []);
  
  // Save profiles to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cloneConfigProfiles', JSON.stringify(profiles));
    } catch (error) {
      console.error('Failed to save profiles:', error);
    }
  }, [profiles]);
  
  const saveCurrentProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a profile name",
        variant: "destructive",
      });
      return;
    }
    
    const newProfile: ConfigProfile = {
      id: Date.now().toString(),
      name: newProfileName,
      options: { ...currentConfig },
      createdAt: Date.now(),
    };
    
    setProfiles([...profiles, newProfile]);
    setNewProfileName('');
    setIsSaveDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Profile "${newProfileName}" saved successfully`,
    });
  };
  
  const loadProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      onLoadProfile(profile.options);
      toast({
        title: "Profile Loaded",
        description: `Loaded configuration: ${profile.name}`,
      });
    }
  };
  
  const deleteProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the load action
    const profile = profiles.find(p => p.id === profileId);
    
    if (profile) {
      setProfiles(profiles.filter(p => p.id !== profileId));
      toast({
        title: "Profile Deleted",
        description: `Deleted: ${profile.name}`,
      });
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <FolderIcon className="mr-2 h-4 w-4" />
            Profiles
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Saved Configurations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {profiles.length === 0 ? (
            <DropdownMenuItem disabled>
              No saved profiles
            </DropdownMenuItem>
          ) : (
            profiles.map(profile => (
              <DropdownMenuItem 
                key={profile.id} 
                onClick={() => loadProfile(profile.id)}
                className="flex justify-between items-center"
              >
                <span>{profile.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive/90"
                  onClick={(e) => deleteProfile(profile.id, e)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
          
          <DropdownMenuSeparator />
          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Save Current Config
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Configuration Profile</DialogTitle>
                <DialogDescription>
                  Enter a name for this configuration to save it for future use.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  id="profileName"
                  placeholder="Profile name (e.g., 'Blog Sites', 'Image Gallery')"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button 
                  onClick={saveCurrentProfile}
                  className="w-full sm:w-auto"
                >
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ConfigProfiles;
