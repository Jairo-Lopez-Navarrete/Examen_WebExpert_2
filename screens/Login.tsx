import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from '../helpers/RootNavigation';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Controleer of de gebruiker al is ingelogd
  useEffect(() => {
    const checkLoggedIn = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        navigation.replace('Profile', { user: JSON.parse(user) });
      }
    };

    checkLoggedIn();
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLogin = async () => {
    if (!name || !password) {
      Alert.alert('Fout', 'Vul alle velden in.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Ophalen van gebruikerslijst uit backend (vervang het pad naar je JSON-server)
      const response = await fetch('http://192.168.156.29:3000/users');
      if (!response.ok) throw new Error('Kon gebruikersgegevens niet ophalen');
  
      const users = await response.json();
      
      // Controleer of de ingevoerde naam en wachtwoord overeenkomen met een bestaande gebruiker
      const matchedUser = users.find(user => user.name === name && user.password === password);
  
      if (!matchedUser) {
        Alert.alert('Fout', 'Onjuiste naam of wachtwoord.');
        return;
      }
  
      // Sla de ingelogde gebruiker op in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(matchedUser));
  
      // Navigeer naar het profiel en stuur de gebruiker mee
      navigation.replace('Profile', { user: matchedUser });
    } catch (error) {
      Alert.alert('Fout', 'Inloggen mislukt, controleer je gegevens.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="Naam" value={name} onChangeText={setName} />
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
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>Inloggen</Text>
          </Pressable>
        )}

        {/* Registreren knop */}
        <Pressable style={styles.registerButton} onPress={() => navigate('Register')}>
          <Text style={styles.registerText}>Heb je nog geen account? Registreer hier.</Text>
        </Pressable>
      </View>
    </ScrollView>
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
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: '#007AFF',
    fontSize: 16,
  },
});