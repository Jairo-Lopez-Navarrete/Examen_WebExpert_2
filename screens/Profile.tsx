import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  
  const [user, setUser] = useState({
    name: "Jairo Lopez Navarrete",
    birthdate: "26/12/2000",
    work: "Working at Kapitan!",
    profilePic: null, // Standaard geen foto
  });

  return (
    <View style={styles.container}>
      <Image source={user.profilePic ? { uri: user.profilePic } : require('../assets/avatarProfile.png')} style={styles.profileImage} />
      <Text style={styles.text}>{user.name}</Text>
      <Text style={styles.text}>{user.birthdate}</Text>
      <Text style={styles.text}>{user.work}</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('EditProfile', { user, setUser })}>
        <Ionicons name="create-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Bewerk Profiel</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={() => Alert.alert("Uitgelogd", "Je bent succesvol uitgelogd.")}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Uitloggen</Text>
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
  },
  profileImage: {
    width: 200,
    height: 250,
    borderRadius: 60,
    marginBottom: 5,
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
    color: '#232323',
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    width: 200,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    width: 200,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
});