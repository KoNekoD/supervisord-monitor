import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router/dist/lib/hooks';

// В react-router 6 выпилили возможность вызывать функции react-router за пределами компонента. react-router - хлам
export const useConfigureReactNavigate = () => {
  const navigateImpl = useNavigate();
  if (!navigate) {
    navigate = navigateImpl;
  }
};

export let navigate: NavigateFunction | undefined;
