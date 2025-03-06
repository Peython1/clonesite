
import fs from 'fs';
import path from 'path';

/**
 * Utility to read configuration from config.json
 * This avoids direct reference to package.json
 */
export function getConfig() {
  try {
    const configPath = path.resolve(process.cwd(), 'config.json');
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error('Error reading config:', error);
    // Default fallback configuration
    return {
      buildOptions: {
        target: "node18-win-x64",
        output: "website_cloner.exe"
      }
    };
  }
}

/**
 * Utility to get build options
 */
export function getBuildOptions() {
  const config = getConfig();
  return config.buildOptions || {};
}
