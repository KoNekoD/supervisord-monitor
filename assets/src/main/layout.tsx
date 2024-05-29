import {Outlet} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {Toaster} from 'react-hot-toast';
import {Header} from "./header";
import {useStore} from "./context-provider";
import {useEffect} from "react";

export const Layout = observer(() => {
    const {landingStore} = useStore();
    useEffect(() => {
        if (landingStore.isDarkThemeActive) {
            console.log("load")
            document.querySelector('html')?.classList.add('dark')
        }
    }, []);

    return (
            <div className="min-h-screen">
                <Toaster/>
                <Header/>
                <Outlet/>
            </div>
    );
});
