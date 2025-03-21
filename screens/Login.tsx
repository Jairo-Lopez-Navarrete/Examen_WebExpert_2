import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [work, setWork] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);  // Voeg een loading state toe

  const handleLogin = async () => {
    if (!name || !birthdate || !work || !password || !confirmPassword) {
      Alert.alert('Fout', 'Vul alle velden in.');
      return;
    }

    // Controleer of de geboortedatum geldig is
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(birthdate)) {
      Alert.alert('Fout', 'Voer een geldige geboortedatum in (Dag-Maand-Jaar).');
      return;
    }

    const [day, month, year] = birthdate.split('-').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birthDateObj.getFullYear();

    if (birthDateObj > today || age < 16) {
      Alert.alert('Fout', 'Je moet boven de 16 zijn!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Fout', 'Het wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Fout', 'De wachtwoorden komen niet overeen.');
      return;
    }

    // Zet de loading state op true wanneer de login wordt gestart
    setLoading(true);

    try {
      const response = await fetch('http://192.168.156.29:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthdate, work, password }),  // Wachtwoord toevoegen aan de payload
      });

      if (!response.ok) throw new Error('Login mislukt');

      const data = await response.json();
      //slaat gegevens op bij AsyncStorage voor offline gebruik
      await AsyncStorage.setItem('user', JSON.stringify(data));

      navigation.replace('Profile', { user: data });
    } catch (error) {
      Alert.alert('Fout', 'Login mislukt, probeer opnieuw.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Naam" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Geboortedatum (DD-MM-YYYY)"
        value={birthdate}
        onChangeText={setBirthdate}
      />
      <TextInput style={styles.input} placeholder="Werk" value={work} onChangeText={setWork} />
      <TextInput
        style={styles.input}
        placeholder="Wachtwoord"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Wachtwoord herhalen"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />  // Laadindicator wanneer aanroep bezig is
      ) : (
        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>Inloggen</Text>
        </Pressable>
      )}
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
    marginBottom: 30,
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
    marginTop: 30,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});