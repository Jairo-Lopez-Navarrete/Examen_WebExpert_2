import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, ScrollView, RefreshControl, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reservations, setReservations] = useState({});

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUserData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
  
        const savedReservations = await AsyncStorage.getItem(`reservations_${parsedUser.email}`);
        if (savedReservations) {
          setReservations(JSON.parse(savedReservations));
        }
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
<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
        <Text style={styles.text}>{user.name}</Text>
        <Text style={styles.text}>{user.birthdate}</Text>
        <Text style={styles.text}>{user.work}</Text>
      </View>
    </View>

    <Pressable style={styles.logoutButton} onPress={handleLogout}>
      <Ionicons name="log-out-outline" style={styles.icons} color="#628395" />
      <Text style={styles.buttonTextLogout}>Uitloggen</Text>
    </Pressable>

    <Text style={styles.sectionTitle}>Geboekte afspraken</Text>

    {Object.keys(reservations).length === 0 ? (
      <Text style={{ color: '#777' }}>Geen geboekte afspraken.</Text>
    ) : (
      Object.keys(reservations).map((date) => (
        <View key={date} style={styles.appointmentItem}>
          <Text style={styles.appointmentText}>
            {date}: {reservations[date]}
          </Text>
        </View>
      ))
    )}

  </View>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  textInfo: {
    alignItems: 'center'
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
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    position: "absolute",
    top: 5,
    left: 60,
    borderRadius: 100,
    marginLeft: 25,
  },
  userPolicyButton: {
    backgroundColor: '#628395',
    padding: 10,
    position: "absolute",
    top: 5,
    right: 20,
    borderRadius: 100,
    //marginLeft: 10,
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
    color: '#628395'
    //textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  appointmentItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  appointmentText: {
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginTop: 15,
    alignItems: 'flex-start',
  }
});