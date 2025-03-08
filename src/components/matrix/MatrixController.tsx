
import React, { useEffect } from 'react';
import { MatrixConfig } from '@/utils/interfaces';
import MatrixRain from '@/components/MatrixRain';
import MatrixConfigPanel from '@/components/MatrixConfigPanel';

interface MatrixControllerProps {
  config: MatrixConfig;
  onChange: (config: MatrixConfig) => void;
}

const MatrixController: React.FC<MatrixControllerProps> = ({ config, onChange }) => {
  useEffect(() => {
    if (window) {
      // Set up global API for matrix effect
      (window as any).configureMatrixEffect = (newConfig: Partial<MatrixConfig>) => {
        onChange({
          ...config,
          ...newConfig
        });
      };
      
      (window as any).startMatrixEffect = () => {
        onChange({
          ...config,
          enabled: true
        });
      };
      
      (window as any).stopMatrixEffect = () => {
        onChange({
          ...config,
          enabled: false
        });
      };
    }
    
    // Check for epilepsy safe mode from local storage
    const epilepsySafe = localStorage.getItem('epilepsySafe') === 'true';
    if (epilepsySafe) {
      onChange({
        ...config,
        enabled: false
      });
    }
  }, []);

  return (
    <>
      <MatrixRain config={config} />
      <div className="absolute top-3 right-3 z-10">
        <MatrixConfigPanel config={config} onChange={onChange} />
      </div>
    </>
  );
};

export default MatrixController;
