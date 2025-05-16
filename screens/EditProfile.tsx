import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, Image, ScrollView, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, setUser } = route.params;

  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.company);
  const [vatNumber, setVatNumber] = useState(user.vatNumber);
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(user.email);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const chooseImageOption = () => {
    Alert.alert(
      'Profielfoto wijzigen',
      'Kies een optie',
      [
        {
          text: 'Profielfoto verwijderen',
          onPress: () => setProfilePic(null),
          style: 'destructive'
        },
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Galerij',
          onPress: pickImage,
        },
        {
          text: 'Annuleren',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Geen toegang', 'We hebben toegang tot je galerij nodig.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Geen toegang', 'We hebben toegang tot je camera nodig.');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = async () => {

    if (!vatNumber || vatNumber.length < 5) {
      Alert.alert("Fout", "Voer een geldig BTW-nummer in.");
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

    const updatedUser = { name, company, vatNumber, profilePic, email, password: password || undefined, currentPassword };

    if (password) {
      updatedUser.password = password;
    }
    
    try {
      const response = await fetch('http://192.168.156.35:3000/EditProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: updatedUser.email, 
          name: updatedUser.name,
          vatNumber: updatedUser.vatNumber,
          company: updatedUser.company,
          profilePic: updatedUser.profilePic,
          password: updatedUser.password,
          currentPassword: updatedUser.currentPassword,
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

        <Pressable onPress={chooseImageOption}>
          <Ionicons name="camera-outline" size={30} color="black" style={styles.cameraIcon} />
          <Image source={profilePic ? { uri: profilePic } : require('../assets/avatarProfile.png')} style={styles.profileImage} resizeMode="cover"/>
        </Pressable>

        <Text style={styles.label}>Naam</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Bedrijfsnaam</Text>
        <TextInput style={styles.input} value={company} onChangeText={setCompany} />

        <Text style={styles.label}>BTW-nummer</Text>
        <TextInput style={styles.input} value={vatNumber} onChangeText={setVatNumber} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" /> 
        <Text style={styles.label}>Huidig Wachtwoord</Text>
        <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        />

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
    fontFamily: 'Poppins_500Medium',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
    // marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    // marginBottom: 10,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  cancelButtonText: {
    fontFamily: 'Poppins_400Regular',
    textDecorationLine: "underline",
    fontSize: 18,
    color: '#000',
    marginLeft: 10,
  },
});