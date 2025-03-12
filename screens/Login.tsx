import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [work, setWork] = useState('');

  // Check of gebruiker al ingelogd is
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        navigation.replace('Profile'); // Direct naar profiel als ingelogd
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!name || !birthdate || !work) {
      Alert.alert('Fout', 'Vul alle velden in.');
      return;
    }

    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(birthdate)) {
     Alert.alert("Fout", "Voer een geldige geboortedatum in (DD-MM-YYYY).");
     return;
  };
  const [day, month, year] = birthdate.split('-').map(Number);
  const birthDateObj = new Date(year, month - 1, day);
  const today = new Date();
  const age = today.getFullYear() - birthDateObj.getFullYear();

  // Controleer of de datum in de toekomst ligt of de gebruiker jonger is dan 16
  if (birthDateObj > today || age < 16) {
    Alert.alert("Fout", "Je moet een geldige datum invoeren.");
    return;
  }
   // Sla gebruiker op in AsyncStorage
   const userData = { name, birthdate, work };
   await AsyncStorage.setItem('user', JSON.stringify(userData));
 
   // Navigeer naar het profiel
   navigation.replace('Profile');
 };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Naam" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Geboortedatum" value={birthdate} onChangeText={setBirthdate} />
      <TextInput style={styles.input} placeholder="Werk" value={work} onChangeText={setWork} />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Inloggen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});