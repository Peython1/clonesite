
export interface CloneOptions {
  url: string;
  outputDir: string;
  maxDepth: number;
  sameHostOnly: boolean;
  // Additional properties needed by the application
  outputPath?: string;
  depth?: number;
  includeExternal?: boolean;
  parallel?: number;
  maxFileSize?: number;
  compressResources?: boolean;
  // Resource types for selective downloading
  resourceTypes?: {
    html: boolean;
    css: boolean;
    js: boolean;
    images: boolean;
    fonts: boolean;
    videos: boolean;
    documents: boolean;
    other: boolean;
  };
}

export interface CloneProgress {
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentUrl?: string;
  processedUrls: number;
  totalUrls: number;
  downloadedBytes: number;
  elapsedTimeMs: number;
  logs: LogEntry[];
  // Stats property needed by the components
  stats?: {
    totalFiles: number;
    downloadedFiles: number;
    failedFiles: number;
    totalSize: number;
    elapsedTime: number;
  };
}

export interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  url?: string;
}

export interface MatrixConfig {
  enabled: boolean;
  opacity: number;
  speed: number;
  color: string;
  density: number;
  fps?: number;
}
