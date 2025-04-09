import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentPage({ route }) {
  const navigation = useNavigation();
  const { selectedTimes } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reservations, setReservations] = useState(selectedTimes);
  const pricePerReservation = 20;
  const totalReservations = Object.keys(reservations).length;
  const totalPrice = totalReservations * pricePerReservation;
  const [refreshing, setRefreshing] = useState(false);
      
        const onRefresh = useCallback(() => {
          setRefreshing(true);
          setTimeout(() => {
            setRefreshing(false);
          }, 2000);
        }, []);

        useEffect(() => {
          const saveReservations = async () => {
            try {
              const userData = await AsyncStorage.getItem('user');
              if (userData) {
                const parsedUser = JSON.parse(userData);
                await AsyncStorage.setItem(`reservations_${parsedUser.email}`, JSON.stringify(reservations));
              }
            } catch (error) {
              console.error('Error saving reservations', error);
            }
          };
        
          saveReservations();
        }, [reservations]);

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Kies eerst een betaalmethode!');
      return;
    }

    alert(`Je hebt €${totalPrice} betaald via ${paymentMethod}.`);
    navigation.navigate('Profile');
  };

  const handleRemoveReservation = (date) => {
    const updatedReservations = { ...reservations };
    delete updatedReservations[date];
    setReservations(updatedReservations);
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
      <Text style={styles.header}>Betalingspagina</Text>
      <Text style={styles.info}>Je hebt de volgende dagen geselecteerd:</Text>

      <FlatList
        data={Object.keys(reservations)}
        renderItem={({ item }) => (
          <View style={styles.reservationItem}>
            <Text style={styles.reservationText}>
              {item}: {reservations[item]}
            </Text>
            <Pressable onPress={() => handleRemoveReservation(item)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Verwijderen</Text>
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item}
      />
      
      <Text style={styles.summary}>Aantal reserveringen: {totalReservations}</Text>
      <Text style={styles.summary}>Totaalprijs: €{totalPrice}</Text>

      <Text style={styles.label}>Kies een betaalmethode:</Text>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecteer een betaalmethode..." value=""/>
        <Picker.Item label="iDEAL" value="iDEAL"/>
        <Picker.Item label="Creditcard" value="Creditcard"/>
        <Picker.Item label="PayPal" value="PayPal"/>
        <Picker.Item label="Bancontact" value="Bancontact"/>
      </Picker>

      <Pressable style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Betalen</Text>
      </Pressable>
    </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  reservationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  reservationText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#e74040',
    padding: 8,
    borderRadius: 100,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  summary: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  payButton: {
    backgroundColor: '#e74040',
    padding: 15,
    borderRadius: 100,
    marginTop: 20,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});