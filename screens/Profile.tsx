import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  // Laad de gebruiker van AsyncStorage bij het laden van de pagina
  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        navigation.replace('Login'); // Stuur gebruiker naar Login als niet ingelogd
      } else {
        setUser(JSON.parse(userData)); // Zet de user-data
      }
    };
    getUser();
  }, []);

  if (!user) return null; // Voorkom error als user niet geladen is

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user'); // Verwijder gegevens
    navigation.replace('Login'); // Stuur terug naar login
  };

  return (
    <View style={styles.container}>
      <Image source={user.profilePic ? { uri: user.profilePic } : require('../assets/avatarProfile.png')} style={styles.profileImage} />
      <Text style={styles.text}>{user.name}</Text>
      <Text style={styles.text}>{user.birthdate}</Text>
      <Text style={styles.text}>{user.work}</Text>

      
      <Pressable style={styles.changeButton} onPress={handleLogout}>
        <Ionicons name="open" style={styles.icons} color="white" />
        <Text style={styles.changeButtonText}>Verander je profiel</Text>
      </Pressable>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" style={styles.icons} color="black" />
        <Text style={styles.buttonTextLogout}>Uitloggen</Text>
      </Pressable>
    </View>
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
  }
});