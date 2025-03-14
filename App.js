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
import CalendarPage from './screens/CalendarPage';
import Kabien from './screens/Kabien';
import Kajuit from './screens/Kajuit';
import EditProfile from './screens/EditProfile';
import Login from './screens/Login';

const Stack = createStackNavigator();

export default function App() {
  const response = fetch('http://192.168.156.29/login');
  const getAPIdata = () => {
    let result = fetch("")
    console.warn(response)
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Header />
             <Stack.Navigator screenOptions={{headerShown: false}}>
             <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="AboutUs" component={AboutUs} />
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen name="Kabien" component={Kabien} />
                <Stack.Screen name="Kajuit" component={Kajuit} />
                <Stack.Screen name="CalendarPage" component={CalendarPage} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
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
