'use client';

// Inspired by react-hot-toast library
import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

// Constants
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// Types
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Toast = Omit<ToasterToast, 'id'>;

interface State {
  toasts: ToasterToast[];
}

// Action types
const ToastActions = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

type ToastAction =
  | { type: typeof ToastActions.ADD_TOAST; toast: ToasterToast }
  | { type: typeof ToastActions.UPDATE_TOAST; toast: Partial<ToasterToast> }
  | { type: typeof ToastActions.DISMISS_TOAST; toastId?: string }
  | { type: typeof ToastActions.REMOVE_TOAST; toastId?: string };

// Toast Manager
class ToastManager {
  private static count = 0;
  private static listeners: Array<(state: State) => void> = [];
  private static memoryState: State = { toasts: [] };
  private static timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  static generateId(): string {
    this.count = (this.count + 1) % Number.MAX_SAFE_INTEGER;
    return this.count.toString();
  }

  static addListener(listener: (state: State) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  static dispatch(action: ToastAction): void {
    this.memoryState = reducer(this.memoryState, action);
    this.listeners.forEach((listener) => listener(this.memoryState));
  }

  static addToRemoveQueue(toastId: string): void {
    if (this.timeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
      this.timeouts.delete(toastId);
      this.dispatch({ type: ToastActions.REMOVE_TOAST, toastId });
    }, TOAST_REMOVE_DELAY);

    this.timeouts.set(toastId, timeout);
  }
}

// Reducer
function reducer(state: State, action: ToastAction): State {
  switch (action.type) {
    case ToastActions.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case ToastActions.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case ToastActions.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        ToastManager.addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          ToastManager.addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }

    case ToastActions.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

// Toast function
function toast(props: Toast) {
  const id = ToastManager.generateId();

  const update = (props: ToasterToast) =>
    ToastManager.dispatch({
      type: ToastActions.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    ToastManager.dispatch({ type: ToastActions.DISMISS_TOAST, toastId: id });

  ToastManager.dispatch({
    type: ToastActions.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}

// Hook
function useToast() {
  const [state, setState] = React.useState<State>({ toasts: [] });

  React.useEffect(() => {
    return ToastManager.addListener(setState);
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      ToastManager.dispatch({ type: ToastActions.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast };
