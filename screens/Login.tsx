import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [work, setWork] = useState('');

  const handleLogin = async () => {
    if (!name || !birthdate || !work) {
      Alert.alert('Fout', 'Vul alle velden in.');
      return;
    }

    try {
      const response = await fetch('http://192.168.156.29:3000/login', {  // API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthdate, work }),
      });

      if (!response.ok) throw new Error('Login mislukt');

      const data = await response.json();
      // Sla de gebruiker op in AsyncStorage voor offline gebruik
      await AsyncStorage.setItem('user', JSON.stringify(data));

      // Navigeer naar het profiel
      navigation.replace('Profile', { user: data });
    } catch (error) {
      Alert.alert('Fout', 'Login mislukt, probeer opnieuw.');
      console.error(error);
    }
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