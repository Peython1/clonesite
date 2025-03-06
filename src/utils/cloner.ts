
import { CloneOptions, CloneProgress, LogEntry } from './interfaces';

// This is a frontend simulation - in a real app, this would connect to a backend service
export class WebsiteCloner {
  private progress: CloneProgress;
  private options: CloneOptions | null = null;
  private abortController: AbortController | null = null;

  constructor() {
    this.progress = {
      status: 'idle',
      stats: {
        totalFiles: 0,
        downloadedFiles: 0,
        failedFiles: 0,
        totalSize: 0,
        elapsedTime: 0
      },
      logs: []
    };
  }

  public getProgress(): CloneProgress {
    return { ...this.progress };
  }

  public async startClone(options: CloneOptions): Promise<void> {
    if (this.progress.status === 'running') {
      throw new Error('Clone operation already in progress');
    }

    this.options = options;
    this.abortController = new AbortController();
    this.progress = {
      status: 'running',
      stats: {
        totalFiles: 0,
        downloadedFiles: 0,
        failedFiles: 0,
        totalSize: 0,
        elapsedTime: 0
      },
      logs: [],
      currentUrl: options.url
    };

    this.addLog('info', `Starting clone of ${options.url}`);
    this.addLog('info', `Output path: ${options.outputPath}`);
    this.addLog('info', `Recursion depth: ${options.depth === 0 ? 'unlimited' : options.depth}`);
    this.addLog('info', `Include external resources: ${options.includeExternal ? 'yes' : 'no'}`);
    this.addLog('info', `Parallel downloads: ${options.parallel}`);

    try {
      // In a real implementation, this would be the actual cloning logic
      await this.simulateCloning();
      
      if (this.abortController.signal.aborted) {
        this.progress.status = 'idle';
        this.addLog('warning', 'Clone operation was cancelled');
      } else {
        this.progress.status = 'completed';
        this.addLog('success', `Clone completed successfully in ${this.progress.stats.elapsedTime.toFixed(2)}s`);
      }
    } catch (error) {
      this.progress.status = 'error';
      this.addLog('error', `Clone failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public cancelClone(): void {
    if (this.progress.status !== 'running' || !this.abortController) {
      return;
    }
    
    this.abortController.abort();
    this.addLog('warning', 'Cancelling clone operation...');
  }

  private addLog(type: LogEntry['type'], message: string, url?: string): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      message,
      type,
      url
    };
    
    this.progress.logs = [logEntry, ...this.progress.logs];
    console.log(`[${type.toUpperCase()}] ${message}${url ? ` (${url})` : ''}`);
  }

  // This is a simulation for the frontend - in a real app this would be actual cloning logic
  private async simulateCloning(): Promise<void> {
    if (!this.options) return;

    const startTime = Date.now();
    const totalSimulatedFiles = Math.floor(Math.random() * 100) + 50; // Random number between 50-150
    this.progress.stats.totalFiles = totalSimulatedFiles;
    
    const fileTypes = ['html', 'css', 'js', 'jpg', 'png', 'svg', 'json', 'pdf'];
    const domains = [
      this.extractDomain(this.options.url),
      'cdn.example.com',
      'assets.example.org',
      'images.example.net'
    ];
    
    const updateInterval = 50; // ms between updates
    
    for (let i = 0; i < totalSimulatedFiles; i++) {
      if (this.abortController?.signal.aborted) {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, updateInterval));
      
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      const isExternal = Math.random() > 0.7; // 30% chance of being external
      const domain = isExternal ? domains[Math.floor(Math.random() * domains.length)] : domains[0];
      const filePath = this.generateRandomPath();
      const fileUrl = `https://${domain}${filePath}.${fileType}`;
      const fileSize = Math.floor(Math.random() * 500) + 10; // Random size between 10-510KB
      
      this.progress.currentUrl = fileUrl;
      
      // Simulate occasional failures
      if (Math.random() > 0.95) { // 5% chance of failure
        this.progress.stats.failedFiles++;
        this.addLog('error', `Failed to download file`, fileUrl);
      } else {
        this.progress.stats.downloadedFiles++;
        this.progress.stats.totalSize += fileSize * 1024; // Convert to bytes
        this.addLog('success', `Downloaded file (${fileSize}KB)`, fileUrl);
      }
      
      this.progress.stats.elapsedTime = (Date.now() - startTime) / 1000;
    }
    
    // Final update
    this.progress.stats.elapsedTime = (Date.now() - startTime) / 1000;
  }
  
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'example.com';
    }
  }
  
  private generateRandomPath(): string {
    const folders = ['assets', 'images', 'scripts', 'styles', 'data', 'docs', 'media', 'content'];
    const depth = Math.floor(Math.random() * 3) + 1; // 1-3 levels deep
    let path = '';
    
    for (let i = 0; i < depth; i++) {
      const folder = folders[Math.floor(Math.random() * folders.length)];
      path += `/${folder}`;
    }
    
    const filename = Math.random().toString(36).substring(2, 8);
    return `${path}/${filename}`;
  }
}
