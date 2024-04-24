import { toast, ToastPosition } from 'react-hot-toast';

type ToastProps = {
  position: ToastPosition;
  duration: number;
};

const commonOptions: ToastProps = {
  position: 'top-right',
  duration: 2000,
};

export class Notificator {
  error(content: any, options?: ToastProps) {
    return toast.error(content, {
      ...commonOptions,
      ...options,
    });
  }

  success(content: any, options?: ToastProps) {
    return toast.success(content, {
      ...commonOptions,
      ...options,
    });
  }

  close = (id: string | undefined) => {
    toast.dismiss(id);
  };
}
