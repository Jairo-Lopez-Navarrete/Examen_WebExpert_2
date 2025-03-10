import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './helpers/RootNavigation';



import Header from './components/Header';
import Footer from './components/Footer';
import Home from './screens/Home';
import Profile from './screens/Profile';
import AboutUs from './screens/AboutUs';
import Kabien from './screens/Kabien';
import Kajuit from './screens/Kajuit';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
            <Header />
             <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="About_Us" component={AboutUs} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Kabien" component={Kabien} />
                <Stack.Screen name="Kajuit" component={Kajuit} />
             </Stack.Navigator>
            <Footer />
       <StatusBar style="auto" />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
