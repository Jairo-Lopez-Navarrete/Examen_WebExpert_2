import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from '../helpers/RootNavigation';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  
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

    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fout', 'Vul alle velden in.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('http://192.168.156.35:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Serverfout:', errorText);
        throw new Error('Inloggen mislukt, controleer je gegevens.');
      }
  
      const result = await response.json();
      console.log('Login geslaagd, gebruiker:', result);
  
      
      await AsyncStorage.setItem('user', JSON.stringify(result));
  
      navigation.replace('Profile', { user: result });
    } catch (error) {
      Alert.alert('Fout', error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="E-mailadres" value={email} onChangeText={setEmail} keyboardType="email-address"/>
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
        <View style={styles.passwordButtonContainer}>
          <Pressable onPress={() => navigate('ForgotPassword')}>
            <Text style={styles.registerText}>Wachtwoord vergeten?</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>Inloggen</Text>
          </Pressable>
        )}
        
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
    width: "100%",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  passwordButtonContainer: {
    alignItems: "flex-end",
    width: "100%"
  },
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: '#007AFF',
    fontSize: 16,
  },
});