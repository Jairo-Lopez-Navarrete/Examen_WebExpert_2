import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reservations, setReservations] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUserData().finally(() => setRefreshing(false));
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Probeer lokale data eerst
      const localData = await AsyncStorage.getItem(`reservations_${parsedUser.email}`);
      if (localData) {
        setReservations(JSON.parse(localData));
      }

      // Haal nieuwe data van de server
      const response = await fetch(`http://192.168.156.35:3000/reservations?email=${parsedUser.email}`);
      const remoteData = await response.json();

      if (JSON.stringify(remoteData) !== localData) {
        setReservations(remoteData);
        await AsyncStorage.setItem(`reservations_${parsedUser.email}`, JSON.stringify(remoteData));
      }
    } catch (error) {
      console.error('Fout bij ophalen gegevens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
    await AsyncStorage.clear();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Even geduld...</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView style={styles.body} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.rowContainer}>
            <Image
              source={user.profilePic ? { uri: user.profilePic } : require('../assets/avatarProfile.png')}
              style={styles.profileImage}
            />

            <Pressable
              style={styles.settingsButton}
              onPress={() => navigation.navigate('EditProfile', { user, setUser })}
            >
              <Ionicons name="pencil" size={24} color="white" />
            </Pressable>
            <Pressable
              style={styles.userPolicyButton}
              onPress={() => navigation.navigate('UserPolicy')}
            >
              <Ionicons name="help" size={24} color="white" />
            </Pressable>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.text}>{user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()}</Text>
            <Text style={styles.text}>{user.company}</Text>
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" style={styles.icons} color="#628395" />
          <Text style={styles.buttonTextLogout}>Uitloggen</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Geboekte afspraken</Text>

        {Array.isArray(reservations) && reservations.length > 0 ? (
          reservations.map(({ date, time, type }, index) => (
            <View key={index} style={styles.appointmentItem}>
              <Text style={styles.appointmentText}>
                {date} | {time} | {type === 'kabien' ? 'Kabien' : type === 'kajuit' ? 'Kajuit' : type}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#777' }}>Geen geboekte afspraken.</Text>
        )}
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
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  userInfo: {
    flex: 1,
    marginTop: 15,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
  },
  settingsButton: {
    backgroundColor: '#628395',
    padding: 10,
    position: 'absolute',
    top: 5,
    left: 60,
    borderRadius: 100,
    marginLeft: 25,
  },
  userPolicyButton: {
    backgroundColor: '#628395',
    padding: 10,
    position: 'absolute',
    top: 5,
    right: 20,
    borderRadius: 100,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 100,
    marginBottom: 20,
  },
  icons: {
    fontSize: 24,
  },
  buttonTextLogout: {
    fontSize: 18,
    marginLeft: 10,
    color: '#628395',
    fontFamily: 'Poppins_400Regular',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Poppins_500Medium',
  },
  appointmentItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  appointmentText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});