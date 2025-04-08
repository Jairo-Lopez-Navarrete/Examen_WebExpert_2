import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, Image, ScrollView, RefreshControl } from 'react-native';
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(user.email);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const pickImage = () => {
    Alert.alert(
      "Kies een optie",
      "Wil je een foto maken of een foto kiezen uit je galerij?",
      [
        {
          text: "Camera",
          onPress: () => launchCamera(),
        },
        {
          text: "Galerij",
          onPress: () => launchImageLibrary(),
        },
        {
          text: "Annuleren",
          style: "cancel",
        },
      ]
    );
  };

  const launchCamera = () => {
    ImagePicker.launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back', 
        saveToPhotos: true, 
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Gebruiker annuleerde het maken van een foto.');
          return;
        }
        if (response.errorCode) {
          console.log('Fout bij het nemen van een foto:', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setProfilePic(response.assets[0].uri);
        }
      }
    );
  };

  const launchImageLibrary = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
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
          setProfilePic(response.assets[0].uri);
        }
      }
    );
  };

  // Opslaan van de wijzigingen in AsyncStorage
  const handleSave = async () => {
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
      Alert.alert("Fout", "Je moet ouder als 16 zijn!");
      return;
    }

    if (password && password.length < 6) {
      Alert.alert('Fout', 'Het wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }

    if (password && password !== confirmPassword) {
      Alert.alert('Fout', 'De wachtwoorden komen niet overeen.');
      return;
    }

    const updatedUser = { name, birthdate, work, profilePic, email, password };

    if (password) {
      updatedUser.password = password;
    }
    
    try {
      const response = await fetch('http://192.168.0.15:3000/EditProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: updatedUser.email, 
          name: updatedUser.name,
          birthdate: updatedUser.birthdate,
          work: updatedUser.work,
          profilePic: updatedUser.profilePic,
          password: updatedUser.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Fout bij het bijwerken van gebruiker');
      }

      const savedUser = await response.json();
      await AsyncStorage.setItem('user', JSON.stringify(savedUser));
      setUser(savedUser);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Fout', `Kon gegevens niet opslaan: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Nieuw Wachtwoord (optioneel)</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Bevestig Wachtwoord</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Opslaan</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close-circle-outline" size={24} color="black" />
          <Text style={styles.cancelButtonText}>Annuleren</Text>
        </Pressable>
      </View>
    </ScrollView>
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
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
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