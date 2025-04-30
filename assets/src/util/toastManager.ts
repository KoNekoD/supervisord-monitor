import { CSSProperties, JSX } from 'react';
import toast from 'react-hot-toast';

/* eslint-disable  @typescript-eslint/no-explicit-any */

interface ToastOptions {
  duration?: number;
  className?: string;
  style?: CSSProperties;
  position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
}

type Renderable = JSX.Element | string | null;

type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;

type ValueOrFunction<TValue, TArg> = TValue | ValueFunction<TValue, TArg>;

const initialOptions: ToastOptions = {
  position: 'top-right',
};

export const toastManager = {
  success(message: string, options?: ToastOptions) {
    toast.success(message, { ...initialOptions, ...options });
  },

  error(message: string, options?: ToastOptions) {
    toast.error(message, { ...initialOptions, ...options });
  },

  loading(message: string, options?: ToastOptions) {
    toast.loading(message, { ...initialOptions, ...options });
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
