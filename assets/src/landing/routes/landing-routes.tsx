import {Outlet} from 'react-router-dom';
import React from "react";
import {LandingPage} from "../pages/landing-page";
import {LandingSettingsPage} from "../pages/landing-settings-page";

export const landingRoutes = [
    {
        path: '/',
        element: <Outlet/>,
        children: [
            {
                index: true,
                element: <LandingPage/>,
            },
            {
              path: 'settings',
              element: <LandingSettingsPage/>,
            },
        ],
    },
];
