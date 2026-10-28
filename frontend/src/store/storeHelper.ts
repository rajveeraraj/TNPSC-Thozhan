import { useSyncExternalStore } from 'react';

export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>)
) => void;

export type GetState<T> = () => T;

export interface StoreHook<T> {
  (): T;
  <U>(selector: (state: T) => U): U;
  getState: () => T;
  setState: (updater: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
}

/**
 * Lightweight, zero-dependency Zustand-compatible store implementation
 * backed by React 18's useSyncExternalStore for tear-free reactivity.
 */
export function create<T>(
  initializer: (set: SetState<T>, get: GetState<T>) => T
): StoreHook<T> {
  let state: T;
  const listeners = new Set<() => void>();

  const getState: GetState<T> = () => state;

  const setState: SetState<T> = (updater) => {
    const nextState = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...nextState };
    listeners.forEach((listener) => listener());
  };

  state = initializer(setState, getState);

  function useStore<U = T>(selector?: (state: T) => U): U {
    const getSnapshot = () => (selector ? selector(state) : (state as unknown as U));

    return useSyncExternalStore(
      (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      getSnapshot,
      getSnapshot
    );
  }

  useStore.getState = getState;
  useStore.setState = setState;
  useStore.subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return useStore as StoreHook<T>;
}
