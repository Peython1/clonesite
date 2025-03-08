
export interface CloneOptions {
  url: string;
  outputDir: string;
  maxDepth: number;
  sameHostOnly: boolean;
  // Novas opções para download seletivo
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
  logs: string[];
}

export interface MatrixConfig {
  enabled: boolean;
  opacity: number;
  speed: number;
  color: string;
  density: number;
  fps?: number;
}
