import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
    
      const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);
  

      useEffect(() => {
        const getUser = async () => {
          try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
              setUser(JSON.parse(userData));
            } else {
              navigation.replace('Login'); // Terug naar login als er geen user is opgeslagen
            }
          } catch (error) {
            console.error('Fout bij het ophalen van de gebruiker:', error);
          } finally {
            setLoading(false);
          }
        };
        getUser();
      }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigation.replace('Login');
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Even geduld...</Text>
      </View>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
      <Image source={user.profilePic ? { uri: user.profilePic } : require('../assets/avatarProfile.png')} style={styles.profileImage} />
      <Text style={styles.text}>{user.name}</Text>
      <Text style={styles.text}>{user.birthdate}</Text>
      <Text style={styles.text}>{user.work}</Text>

      <Pressable style={styles.changeButton} onPress={() => navigation.navigate('EditProfile', { user, setUser })}>
        <Ionicons name="open" style={styles.icons} color="white" />
        <Text style={styles.changeButtonText}>Verander je profiel</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" style={styles.icons} color="black" />
        <Text style={styles.buttonTextLogout}>Uitloggen</Text>
      </Pressable>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  icons: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 60,
    marginBottom: 5,
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
    color: '#232323',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    width: 200,
  },
  buttonTextLogout: {
    textDecorationLine: "underline",
    fontSize: 18,
    color: '#000',
    marginLeft: 10,
  },
  changeButton: {
    backgroundColor: '#be5746',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    width: 200,
  },
  changeButtonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});