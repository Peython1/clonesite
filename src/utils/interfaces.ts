
export interface CloneOptions {
  url: string;
  depth: number;
  includeExternal: boolean;
  outputPath: string;
  parallel: number;
}

export interface CloneStats {
  totalFiles: number;
  downloadedFiles: number;
  failedFiles: number;
  totalSize: number;
  elapsedTime: number;
}

export interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  url?: string;
}

export interface CloneProgress {
  status: 'idle' | 'running' | 'completed' | 'error';
  stats: CloneStats;
  logs: LogEntry[];
  currentUrl?: string;
}
