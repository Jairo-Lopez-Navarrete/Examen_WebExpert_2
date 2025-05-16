import React, { useState, useEffect, useCallback } from 'react';
import {View,Text,StyleSheet,TextInput,Pressable,Alert,ScrollView,RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ContactPage() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUser();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Fout bij ophalen gebruiker:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Vul eerst een bericht in.');
      return;
    }

    try {
      await fetch('http://192.168.156.35:3000/send-contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name,
          company: user?.company,
          email: user?.email,
          vatNumber: user?.vatNumber,
          message: message,
        }),
      });

      Alert.alert('Verzonden', 'Je bericht is verzonden!');
      setMessage('');
    } catch (error) {
      console.error('Fout bij verzenden:', error);
      Alert.alert('Er is iets fout gegaan.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Contacteer ons</Text>

      {user && (
        <View style={styles.userInfo}>
          <Text>Naam: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>bedrijfsnaam: {user.company}</Text>
          <Text>BTW-nummer: {user.vatNumber}</Text>
        </View>
      )}

      <Text style={styles.label}>Jouw bericht:</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Typ hier je vraag of opmerking..."
        value={message}
        onChangeText={setMessage}
      />

      <Pressable style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Verzenden</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 24,
    marginBottom: 20,
    color: '#232323',
  },
  userInfo: {
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    color: '#232323',
  },
  label: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    marginBottom: 10,
    color: '#232323',
  },
  textInput: {
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#eaeaea',
    height: 120,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
    color: '#232323',
  },
  sendButton: {
    backgroundColor: '#2B4570',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  sendButtonText: {
    fontFamily: 'Poppins_400Regular',
    color: '#fff',
    fontSize: 18,
  },
});