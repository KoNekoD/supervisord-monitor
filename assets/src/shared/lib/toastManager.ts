import toast from 'react-hot-toast';
import { CSSProperties } from 'react';

interface ToastOptions {
  duration?: number;
  className?: string;
  style?: CSSProperties;
  position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
}

type Renderable = JSX.Element | string | null;

type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;

type ValueOrFunction<TValue, TArg> = TValue | ValueFunction<TValue, TArg>;

export const toastManager = {
  success(message: string, options?: ToastOptions) {
    toast.success(message, options);
  },

  error(message: string, options?: ToastOptions) {
    toast.error(message, options);
  },

  loading(message: string, options?: ToastOptions) {
    toast.loading(message, options);
  },

  promise<T>(
    promise: Promise<T>,
    msgs: {
      loading: Renderable;
      success: ValueOrFunction<Renderable, T>;
      error: ValueOrFunction<Renderable, any>;
    },
    opts?: ToastOptions
  ): Promise<T> {
    return toast.promise(promise, {
      loading: msgs.loading,
      success: msgs.success,
      error: msgs.error,
      ...opts,
    });
  },
};
