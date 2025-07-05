import { useEffect, useRef, useCallback } from 'react';
import { health } from '../common/api';

export interface UseHeartbeatOptions {
  /** 心跳间隔时间（毫秒），默认5分钟 */
  interval?: number;
  /** 是否启用心跳，默认为true */
  enabled?: boolean;
  /** 心跳失败时的回调函数 */
  onError?: (error: any) => void;
  /** 心跳成功时的回调函数 */
  onSuccess?: () => void;
}

export interface UseHeartbeatReturn {
  /** 手动触发心跳 */
  sendHeartbeat: () => Promise<void>;
  /** 停止心跳 */
  stopHeartbeat: () => void;
  /** 开始心跳 */
  startHeartbeat: () => void;
  /** 心跳是否正在运行 */
  isRunning: boolean;
  /** 最后一次心跳的时间戳 */
  lastHeartbeat: number | null;
  /** 心跳错误信息 */
  error: any;
}

/**
 * 简单心跳hooks，每5分钟请求一次health接口
 *
 * @param options 配置选项
 * @returns 心跳控制方法和状态
 *
 * @example
 * ```tsx
 * const { isRunning, error, sendHeartbeat } = useHeartbeat({
 *   onError: (error) => console.error('Health check failed:', error),
 *   onSuccess: () => console.log('Health check successful')
 * });
 * ```
 */
export const useHeartbeat = (
  options: UseHeartbeatOptions = {}
): UseHeartbeatReturn => {
  const {
    interval = 5 * 60 * 1000, // 5分钟
    enabled = true,
    onError,
    onSuccess
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);
  const lastHeartbeatRef = useRef<number | null>(null);
  const errorRef = useRef<any>(null);

  // 发送心跳请求
  const sendHeartbeat = useCallback(async (): Promise<void> => {
    try {
      await health();
      lastHeartbeatRef.current = Date.now();
      errorRef.current = null;
      onSuccess?.();
    } catch (error) {
      errorRef.current = error;
      onError?.(error);
      console.error('Health check failed:', error);
    }
  }, [onSuccess, onError]);

  // 开始心跳
  const startHeartbeat = useCallback(() => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;

    // 立即发送一次心跳
    sendHeartbeat();

    // 设置定时器
    intervalRef.current = setInterval(() => {
      sendHeartbeat();
    }, interval);
  }, [interval, sendHeartbeat]);

  // 停止心跳
  const stopHeartbeat = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isRunningRef.current = false;
  }, []);

  // 组件挂载时启动心跳
  useEffect(() => {
    if (enabled) {
      startHeartbeat();
    }

    // 组件卸载时清理
    return () => {
      stopHeartbeat();
    };
  }, [enabled, startHeartbeat, stopHeartbeat]);

  // 当配置改变时重启心跳
  useEffect(() => {
    if (enabled && isRunningRef.current) {
      stopHeartbeat();
      startHeartbeat();
    }
  }, [interval, enabled, startHeartbeat, stopHeartbeat]);

  return {
    sendHeartbeat,
    stopHeartbeat,
    startHeartbeat,
    isRunning: isRunningRef.current,
    lastHeartbeat: lastHeartbeatRef.current,
    error: errorRef.current
  };
};
