import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [email, setEmail] = useState('');
  const [company, setcompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setName('');
    setVatNumber('');
    setEmail('');
    setcompany('');
    setPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleRegister = async () => {
    if (!name || !vatNumber || !email || !company || !password || !confirmPassword) {
      Alert.alert('Fout', 'Vul alle velden in.');
      return;
    }

    const vatRegex = /^NL[0-9]{9}B[0-9]{2}$/i;
    if (!vatRegex.test(vatNumber)) {
      Alert.alert('Fout', 'Voer een geldig btw-nummer in (bijv. NL123456789B01).');
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

    setLoading(true);

    try {
      const response = await fetch('http://192.168.2.19:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, vatNumber, email, company, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registreren mislukt');
      }

      await AsyncStorage.setItem('user', JSON.stringify(data));
      navigation.replace('Profile', { user: data });

    } catch (error) {
      Alert.alert('Fout', error.message || 'Registreren mislukt, probeer opnieuw.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.body} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <Text style={styles.title}>Registreren</Text>
        <TextInput style={styles.input} placeholder="Naam" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="E-mailadres"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
         <TextInput
          style={styles.input}
          placeholder="BTW-nummer (NL123456789B01)"
          value={vatNumber}
          onChangeText={setVatNumber}
        />
        <TextInput style={styles.input} placeholder="Bedrijfsnaam" value={company} onChangeText={setcompany} />
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
          <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>Registreer</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#f5f5f5',
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
  button: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});