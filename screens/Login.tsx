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
    <ScrollView style={styles.body} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
            <Text style={styles.buttonText}>Wachtwoord vergeten?</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Pressable style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginText}>Inloggen</Text>
          </Pressable>
        )}


        <Pressable onPress={() => navigate('Register')}>
          <Text style={styles.buttonRegisterText}>Heb je nog geen account?{"\n"} registreer je hier.</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#f5f5f5'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontFamily: 'Poppins_500Medium',
    color: '#232323',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
  buttonRegisterText: {
    marginTop: 55,
    fontSize: 18,
    color: '#007AFF',
    fontFamily: 'Poppins_400Regular',
    textAlign: "center"
  },
  buttonText: {
    marginTop: 5,
    fontSize: 13,
    textDecorationLine: "underline",
    color: '#007AFF',
    fontFamily: 'Poppins_400Regular',
  },
  passwordButtonContainer: {
    alignItems: "flex-end",
    width: "100%"
  },
  loginButton: {
    marginTop: 40,
    backgroundColor: '#007AFF',
    padding: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 8,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
  },
});