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
      const savedReservations = await AsyncStorage.getItem('reservations');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (savedReservations) {
        setReservations(JSON.parse(savedReservations));
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

    {/* PROFIELGEDEELTE */}
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
          <Ionicons name="settings-outline" size={24} color="white" />
        </Pressable>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.text}>{user.name}</Text>
        <Text style={styles.text}>{user.birthdate}</Text>
        <Text style={styles.text}>{user.work}</Text>
      </View>
    </View>

    {/* UITLOG KNOP */}
    <Pressable style={styles.logoutButton} onPress={handleLogout}>
      <Ionicons name="log-out-outline" style={styles.icons} color="black" />
      <Text style={styles.buttonTextLogout}>Uitloggen</Text>
    </Pressable>

    {/* GEBOEKTE AFSPRAKEN */}
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  textInfo: {
    alignItems: 'center'
  },
  imageAndButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
    width: 200,
    height: 200,
    borderRadius: 60,
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
    borderRadius: 10,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    justifyContent: 'center',
  },
  icons: {
    fontSize: 24,
  },
  buttonTextLogout: {
    fontSize: 18,
    marginLeft: 10,
    textDecorationLine: 'underline',
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