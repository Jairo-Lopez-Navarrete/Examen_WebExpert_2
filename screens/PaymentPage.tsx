import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentPage({ route }) {
  const navigation = useNavigation();
  const { selectedTimes, type } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reservations, setReservations] = useState(selectedTimes);
  const totalReservations = Object.keys(reservations).length;
  const [refreshing, setRefreshing] = useState(false);

  const getPricePerReservation = (type) => {
    switch (type) {
      case 'kabien':
        return 35;
      case 'kajuit':
        return 100;
      default:
        return 20; // fallback voor veiligheid
    }
  };
  
  const pricePerReservation = getPricePerReservation(type);

  const totalPrice = totalReservations * pricePerReservation;  
      
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

        const handlePayment = async () => {
          if (!paymentMethod) {
            alert('Kies eerst een betaalmethode!');
            return;
          }
        
          try {
            const userData = await AsyncStorage.getItem('user');
            const parsedUser = userData ? JSON.parse(userData) : {};
        
            // Maak nieuwe array in het juiste formaat
            const reservationArray = Object.entries(reservations).map(([date, time]) => ({
              type: type.charAt(0).toUpperCase() + type.slice(1), // Kabien / Kajuit
              date,
              time,
            }));
        
            // Opslaan in AsyncStorage (optioneel, zoals eerder)
            await AsyncStorage.setItem(
              `reservations_${parsedUser.email}`,
              JSON.stringify(reservations)
            );
        
            // Push naar backend (nieuw endpoint maken!)
            const saveResponse = await fetch('http://192.168.156.35:3000/save-reservation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reservations: reservationArray,
              }),
            });
        
            if (!saveResponse.ok) {
              const saveError = await saveResponse.json();
              throw new Error(saveError.error || 'Fout bij opslaan reserveringen');
            }
        
            // E-mail versturen zoals eerder
            const emailResponse = await fetch('http://192.168.156.35:3000/send-confirmation-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: parsedUser.email,
                name: parsedUser.name,
                reservations: reservations,
                totalPrice: totalPrice,
                method: paymentMethod,
              }),
            });
        
            const emailData = await emailResponse.json();
        
            if (emailResponse.ok) {
              alert('Betaling gelukt! Je ontvangt spoedig een bevestiging.');
              navigation.navigate('Profile');
            } else {
              alert(`Er ging iets mis: ${emailData.error || 'Onbekende fout'}`);
            }
          } catch (error) {
            console.error('Fout bij betaling:', error);
            alert('Er ging iets mis bij het verwerken van de betaling.');
          }
        };

        const handleRemoveReservation = (date) => {
          const updatedReservations = { ...reservations };
          delete updatedReservations[date];
          setReservations(updatedReservations);
        };

  return (
    <ScrollView style={styles.body} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
        <Picker.Item label="Cash" value="Cash"/>
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
  body: {
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Poppins_500Medium',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
  reservationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  reservationText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  removeButton: {
    backgroundColor: '#e74040',
    padding: 8,
    borderRadius: 100,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  summary: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Poppins_400Regular',
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_500Medium',
  },
});