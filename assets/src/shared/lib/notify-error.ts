import { toast } from 'react-hot-toast';

export const notifyError = (err: any) => toast.error(err.message ?? 'Something went wrong: ' + '\n\n' + err.response.data.detail ?? 'No details');
