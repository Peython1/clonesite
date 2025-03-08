
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Clock, FileArchive, Ban, Wifi,
  Check, X, Database, Layers, Download
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CloneProgress } from '@/utils/interfaces';

interface ProcessIndicatorProps {
  progress: CloneProgress;
  onCancel: () => void;
}

const ProcessIndicator: React.FC<ProcessIndicatorProps> = ({ progress, onCancel }) => {
  const { stats, status, currentUrl } = progress;
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const percent = stats && stats.totalFiles > 0 
    ? Math.round((stats.downloadedFiles / stats.totalFiles) * 100) 
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-xl border shadow-subtle p-6 mt-6 max-w-3xl mx-auto"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              status === 'running' ? "bg-primary/10 text-primary animate-pulse" :
              status === 'completed' ? "bg-green-100 text-green-600" :
              status === 'failed' ? "bg-red-100 text-red-600" :
              "bg-secondary text-secondary-foreground"
            )}>
              {status === 'running' && <Download className="h-4 w-4" />}
              {status === 'completed' && <Check className="h-4 w-4" />}
              {status === 'failed' && <X className="h-4 w-4" />}
              {status === 'idle' && <Layers className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="font-medium">
                {status === 'running' && 'Cloning in progress'}
                {status === 'completed' && 'Cloning completed'}
                {status === 'failed' && 'Cloning failed'}
                {status === 'idle' && 'Ready to clone'}
              </h3>
              <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-md">
                {currentUrl ? currentUrl : 'No active downloads'}
              </p>
            </div>
          </div>
          
          {status === 'running' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Ban className="h-3.5 w-3.5 mr-1.5" />
              <span>Cancel</span>
            </Button>
          )}
        </div>
        
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span>{percent}%</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard 
            icon={<FileArchive className="h-4 w-4" />}
            label="Files"
            value={stats ? `${stats.downloadedFiles}/${stats.totalFiles}` : '0/0'}
          />
          
          <StatCard 
            icon={<Database className="h-4 w-4" />}
            label="Data Transferred"
            value={stats ? formatBytes(stats.totalSize) : '0 B'}
          />
          
          <StatCard 
            icon={<Clock className="h-4 w-4" />}
            label="Elapsed Time"
            value={stats ? `${stats.elapsedTime.toFixed(1)}s` : '0.0s'}
          />
          
          <StatCard 
            icon={<Wifi className="h-4 w-4" />}
            label="Transfer Rate"
            value={stats && stats.elapsedTime > 0 
              ? formatBytes(stats.totalSize / stats.elapsedTime) + '/s' 
              : '0 KB/s'
            }
          />
        </div>
      </div>
    </motion.div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 flex flex-col">
      <div className="flex items-center text-muted-foreground mb-1">
        {icon}
        <span className="text-xs ml-1.5">{label}</span>
      </div>
      <div className="text-foreground font-medium">{value}</div>
    </div>
  );
};

export default ProcessIndicator;
