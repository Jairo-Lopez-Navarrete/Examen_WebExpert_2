import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Fout', 'Vul je e-mailadres in.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.2.19:3000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Succes', 'Er is een e-mail gestuurd naar je Outlook met een code om je wachtwoord te resetten.');
      } else {
        Alert.alert('Fout', result.message || 'E-mailadres niet gevonden.');
      }
    } catch (error) {
      Alert.alert('Fout', 'Er is iets misgegaan. Probeer opnieuw.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wachtwoord vergeten</Text>
      <Text style={styles.info}>Voer je e-mailadres in om een herstelcode te ontvangen.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mailadres"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Pressable style={styles.button} onPress={handleSendCode}>
          <Text style={styles.buttonText}>Verzend code</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});