import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import {navigationRef} from './helpers/RootNavigation';


//components
import Header from './components/Header';
import Footer from './components/Footer';
// import CustomDrawer from './components/CustomDrawer'

//screens
import Home from './screens/Home';
import Profile from './screens/Profile';
import AboutUs from './screens/AboutUs';
import CalendarPage from './screens/CalendarPage';
import Kabien from './screens/Kabien';
import Kajuit from './screens/Kajuit';
import EditProfile from './screens/EditProfile';
import Login from './screens/Login';
import PaymentPage from './screens/PaymentPage';

const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();


// niet werkende versie van navigatie (met drawer).

// const StackNavigator = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="Login" component={Login} />
//     <Stack.Screen name="Home" component={Home} />
//     <Stack.Screen name="AboutUs" component={AboutUs} />
//     <Stack.Screen name="Profile" component={Profile} />
//     <Stack.Screen name="Kabien" component={Kabien} />
//     <Stack.Screen name="Kajuit" component={Kajuit} />
//     <Stack.Screen name="CalendarPage" component={CalendarPage} />
//     <Stack.Screen name="PaymentPage" component={PaymentPage} />
//     <Stack.Screen name="EditProfile" component={EditProfile} />
//   </Stack.Navigator>
// );

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Header />
//       <Drawer.Navigator screenOptions={{ headerShown: false }}>
//         <Drawer.Screen name="Home" component={StackNavigator} />
//         <Drawer.Screen name="About Us" component={AboutUs} />
//         <Drawer.Screen name="Profile" component={Profile} />
//         <Drawer.Screen name="Settings" component={EditProfile} />
//       </Drawer.Navigator>
//       <Footer />
//       <StatusBar style="auto" />
//     </NavigationContainer>
//   );
// };






// eerst gebruikde ik export default function App(){}, maar deze lijkt niet te werken met usewindowdimensions

const App = () => {
  const {height, width, scale, fontScale} = useWindowDimensions();

  return (
    <NavigationContainer ref={navigationRef}>
    <Header />
           <Stack.Navigator screenOptions={{headerShown: false}}>
           <Stack.Screen name="Login" component={Login}/>
              <Stack.Screen name="Home" component={Home}/>
              <Stack.Screen name="AboutUs" component={AboutUs} />
              <Stack.Screen name="Profile" component={Profile}/>
              <Stack.Screen name="Kabien" component={Kabien} />
              <Stack.Screen name="Kajuit" component={Kajuit} />
              <Stack.Screen name="CalendarPage" component={CalendarPage}/>
              <Stack.Screen name="PaymentPage" component={PaymentPage} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
           </Stack.Navigator>
          <Footer />
     <StatusBar style="auto" />
   </NavigationContainer>
);
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeBox: {
    width: 150,
    height: 150,
  },
  portraitBox: {
    width: 100,
    height: 100,
  },
});