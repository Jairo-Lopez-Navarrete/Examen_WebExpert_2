import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {useFonts, Poppins_400Regular, Poppins_500Medium} from '@expo-google-fonts/poppins';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './helpers/RootNavigation';


//import Header from './components/Header';
import Footer from './components/Footer';


import Home from './screens/Home';
import Profile from './screens/Profile';
import AboutUs from './screens/AboutUs';
import CalendarPage from './screens/CalendarPage';
import Kabien from './screens/Kabien';
import Kajuit from './screens/Kajuit';
import EditProfile from './screens/EditProfile';
import Login from './screens/Login';
import Register from './screens/Register';
import PaymentPage from './screens/PaymentPage';
import ForgotPassword from './screens/ForgotPassword';
import UserPolicy from './screens/UserPolicy';
import ContactPage from './screens/ContactPage';

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular, Poppins_500Medium
  })

  if (!fontsLoaded) return null;
  // const [refreshing, setRefreshing] = useState(false);

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 2000);
  // }, []);

  return (
    <NavigationContainer ref={navigationRef}>

      <SafeAreaProvider>

      
        <SafeAreaView style={styles.container}>

          {/* de pull-to-refresh wilt niet werken a.t.m */}
        {/* <ScrollView
            style={styles.hiddenScrollView}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View style={{ height: 1 }}></View>
          </ScrollView> */}
           {/* de pull-to-refresh wilt niet werken a.t.m */}

          {/* <Header /> */}
          <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#2b4570', height: 66}, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'regular',fontSize: 20, fontFamily: 'Poppins_500Medium'}, }}  >
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
            <Stack.Screen name="Kabien" component={Kabien} />
            <Stack.Screen name="Kajuit" component={Kajuit} />
            <Stack.Screen name="CalendarPage" component={CalendarPage} />
            <Stack.Screen name="PaymentPage" component={PaymentPage} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="UserPolicy" component={UserPolicy} />
            <Stack.Screen name="ContactPage" component={ContactPage} />
          </Stack.Navigator>
          <Footer />
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
            headerTintColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#FDF5EC',
  },
  text: {
    fontFamily: 'Poppins_500Medium',
    //fontWeight: 500,
    fontSIze: 24
  }
  // hiddenScrollView: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   height: 0,
  // },
});