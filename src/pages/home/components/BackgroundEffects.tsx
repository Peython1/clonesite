
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PowerIcon } from 'lucide-react';

interface BackgroundEffectsProps {
  isMatrixEnabled?: boolean;
  onToggleMatrix?: () => void;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ 
  isMatrixEnabled = true, 
  onToggleMatrix 
}) => {
  return (
    <div className="relative">
      {onToggleMatrix && (
        <Button 
          variant="outline" 
          size="icon"
          className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
          onClick={onToggleMatrix}
          title={isMatrixEnabled ? "Disable Matrix Effect" : "Enable Matrix Effect"}
          aria-label={isMatrixEnabled ? "Disable Matrix Effect" : "Enable Matrix Effect"}
        >
          <PowerIcon className={isMatrixEnabled ? "text-green-500" : "text-muted-foreground"} />
        </Button>
      )}
      
      <motion.div
        initial={{ opacity:.0 }}
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
  );
};

export default BackgroundEffects;
