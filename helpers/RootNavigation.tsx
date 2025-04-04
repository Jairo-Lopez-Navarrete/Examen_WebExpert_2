import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

type Routes = {
    'AboutUs': string;
    'Home': string;
    'Profile': string;
    'Settings': string;
    'Kabien': string;
    'Kajuit': string;
    'CalendarPage': string;
    'EditProfile': string;
    'PaymentPage': string;
    'Login': string;
    'Register': string;
    'ForgotPassword': string;
    'UserPolicy': string;
};

export const navigationRef = React.createRef<NavigationContainerRef<Routes>>();

export function navigate(name: keyof Routes) {
    navigationRef.current?.navigate(name);
}