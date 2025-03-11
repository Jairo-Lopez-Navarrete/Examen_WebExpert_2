import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

type Routes = {
    'AboutUs': string;
    'About': string;
    'Home': string;
    'Profile': string;
    'Settings': string;
    'Kabien': string;
    'Kajuit': string;
    'Calendar': string;
    'EditProfile': string;
};

export const navigationRef = React.createRef<NavigationContainerRef<Routes>>();

export function navigate(name: keyof Routes) {
    navigationRef.current?.navigate(name);
}