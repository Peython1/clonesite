
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, InfoIcon, CheckCircle, 
  AlertCircle, AlertTriangle, Clock,
  ExternalLink, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogEntry } from '@/utils/interfaces';

interface LogDisplayProps {
  logs: LogEntry[];
  className?: string;
}

const LogDisplay: React.FC<LogDisplayProps> = ({ logs, className }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const getIconByType = (type: LogEntry['type']) => {
    switch (type) {
      case 'info': return <InfoIcon className="h-3.5 w-3.5 text-blue-500" />;
      case 'success': return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
      case 'error': return <AlertCircle className="h-3.5 w-3.5 text-red-500" />;
      default: return <InfoIcon className="h-3.5 w-3.5" />;
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  // Copy logs to clipboard
  const copyLogs = () => {
    const logText = logs.map(log => 
      `[${formatTime(log.timestamp)}] [${log.type.toUpperCase()}] ${log.message}${log.url ? ` (${log.url})` : ''}`
    ).join('\n');
    
    navigator.clipboard.writeText(logText);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn(
        "bg-card border rounded-xl shadow-subtle overflow-hidden",
        className
      )}
    >
      <div className="p-3 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center">
          <ClipboardList className="h-4 w-4 mr-2" />
          <h3 className="font-medium text-sm">Activity Log</h3>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyLogs}
          disabled={logs.length === 0}
          className="text-xs h-7 px-2"
        >
          <span>Copy</span>
        </Button>
      </div>
      
      <div 
        ref={scrollRef}
        className="overflow-y-auto h-[240px] overflow-x-hidden"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Download className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs">Logs will appear here during cloning</p>
          </div>
        ) : (
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={`${log.timestamp.getTime()}-${index}`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "py-2 px-3 border-b last:border-b-0 flex text-sm",
                  "hover:bg-muted/20 transition-colors"
                )}
              >
                <div className="w-10 flex-shrink-0 pt-0.5">
                  {getIconByType(log.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm break-words">{log.message}</p>
                  
                  {log.url && (
                    <div className="mt-1 flex items-center">
                      <a 
                        href={log.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-muted-foreground truncate hover:underline hover:text-primary transition-colors flex items-center"
                      >
                        <span className="truncate max-w-[280px]">{log.url}</span>
                        <ExternalLink className="h-3 w-3 ml-1 inline flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex items-start pt-0.5">
                  <Clock className="h-3 w-3 mr-1 inline" />
                  <span>{formatTime(log.timestamp)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default LogDisplay;
