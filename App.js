import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RefreshControl, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './helpers/RootNavigation';

// components
import Header from './components/Header';
import Footer from './components/Footer';

// screens
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

const App = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
        <ScrollView
            style={styles.hiddenScrollView}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View style={{ height: 1 }}></View>
          </ScrollView>
          <Header />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Kabien" component={Kabien} />
            <Stack.Screen name="Kajuit" component={Kajuit} />
            <Stack.Screen name="CalendarPage" component={CalendarPage} />
            <Stack.Screen name="PaymentPage" component={PaymentPage} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
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
  container: {
    flex: 1,
    backgroundColor: '#FDF5EC',
  },
  hiddenScrollView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0,
  },
});