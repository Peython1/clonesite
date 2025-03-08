
import { useEffect, useRef } from 'react';

/**
 * Hook that runs an effect only once (on mount)
 */
export function useEffectOnce(effect: () => void | (() => void)) {
  const hasRun = useRef(false);
  
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
