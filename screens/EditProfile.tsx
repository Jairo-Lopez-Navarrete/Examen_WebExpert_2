import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, setUser } = route.params;

  const [name, setName] = useState(user.name);
  const [birthdate, setBirthdate] = useState(user.birthdate);
  const [work, setWork] = useState(user.work);
  const [profilePic, setProfilePic] = useState(user.profilePic);

  // Functie voor het kiezen van een afbeelding
  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1, // Zorgt ervoor dat er maar één afbeelding wordt gekozen
      },
      (response) => {
        if (response.didCancel) {
          console.log('Gebruiker annuleerde het kiezen van een afbeelding.');
          return;
        }
        if (response.errorMessage) {
          console.log('Fout bij het selecteren van afbeelding:', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setProfilePic(response.assets[0].uri); // Zet de afbeelding in de state
        }
      }
    );
  };

  // Functie voor het opslaan van de wijzigingen in AsyncStorage
  const handleSave = async () => {
    // Controleer of de geboortedatum correct is
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(birthdate)) {
      Alert.alert("Fout", "Voer een geldige geboortedatum in (Dag-Maand-Jaar).");
      return;
    }
  
    const [day, month, year] = birthdate.split('-').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birthDateObj.getFullYear();
  
    if (birthDateObj > today || age < 16) {
      Alert.alert("Fout", "Voer een geldige datum in!");
      return;
    }
  
    const updatedUser = { name, birthdate, work, profilePic };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    Alert.alert("Opgeslagen!", "Je profiel is bijgewerkt.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bewerk je profiel</Text>

      <Pressable onPress={pickImage}>
      <Ionicons name="camera-outline" size={30} color="black" style={styles.cameraIcon} />
        <Image source={profilePic ? { uri: profilePic } : require('../assets/avatarProfile.png')} style={styles.profileImage} />
      </Pressable>

      <Text style={styles.label}>Naam</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Geboortedatum</Text>
      <TextInput style={styles.input} value={birthdate} onChangeText={setBirthdate} />

      <Text style={styles.label}>Werk</Text>
      <TextInput style={styles.input} value={work} onChangeText={setWork} />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Opslaan</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close-circle-outline" size={24} color="black" />
        <Text style={styles.cancelButtonText}>Annuleren</Text>
      </Pressable>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 10,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  cancelButtonText: {
    textDecorationLine: "underline",
    fontSize: 18,
    color: '#000',
    marginLeft: 10,
  },
});