import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  signature: string;
  status: 'idle' | 'running' | 'done' | 'error';
  times: number[];
  error: string | null;
  onRun: () => void;
  children?: ReactNode;
};

export function TestSection({ title, signature, status, times, error, onRun, children }: Props) {
  const last = times.length > 0 ? times[times.length - 1] : null;
  const first = times.length > 0 ? times[0] : null;
  const average = times.length > 0 ? times.reduce((sum, value) => sum + value, 0) / times.length : null;
  const fastest = times.length > 0 ? Math.min(...times) : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.signature}>{signature}</Text>
        </View>
        <Pressable
          onPress={onRun}
          disabled={status === 'running'}
          style={[styles.button, status === 'running' && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{status === 'running' ? 'Rodando…' : 'Rodar'}</Text>
        </Pressable>
      </View>

      {last !== null && (
        <View style={styles.stats}>
          <Text style={styles.statMain}>{last.toFixed(1)} ms</Text>
          <Text style={styles.stat}>
            1ª {first?.toFixed(1)} · média {average?.toFixed(1)} · mín {fastest?.toFixed(1)} · {times.length}x
          </Text>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16161d',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: '#f2f2f5',
    fontSize: 16,
    fontWeight: '700',
  },
  signature: {
    color: '#8b8b99',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    cursor: 'pointer',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  statMain: {
    color: '#4ade80',
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  stat: {
    color: '#8b8b99',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  error: {
    color: '#f87171',
    fontSize: 12,
  },
});
