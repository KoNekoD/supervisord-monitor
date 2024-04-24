import React from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider as BrowserRouterProvider} from 'react-router-dom';
import {browserRouter} from './routes';
import {ProviderRootStore} from './context-provider';

function App() {
    return (
            <ProviderRootStore>
                <BrowserRouterProvider router={browserRouter}/>
            </ProviderRootStore>
    );
}

createRoot(document.getElementById('root')!).render(<App/>);
