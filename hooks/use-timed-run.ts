import { useCallback, useState } from 'react';

export type TimedRun<T> = {
  status: 'idle' | 'running' | 'done' | 'error';
  data: T | null;
  error: string | null;
  times: number[];
  run: () => Promise<void>;
};

export function useTimedRun<T>(task: () => Promise<T>): TimedRun<T> {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [times, setTimes] = useState<number[]>([]);

  const run = useCallback(async () => {
    setStatus('running');
    setError(null);
    const start = performance.now();
    try {
      const result = await task();
      const elapsed = performance.now() - start;
      setData(result);
      setTimes((previous) => [...previous, elapsed]);
      setStatus('done');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
      setStatus('error');
    }
  }, [task]);

  return { status, data, error, times, run };
}
