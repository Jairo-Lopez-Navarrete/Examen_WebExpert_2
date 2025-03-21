import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PaymentPage({ route }) {
  const { selectedTimes } = route.params; // Ontvang de geselecteerde dagen en tijden

  const [paymentMethod, setPaymentMethod] = useState(''); // Gekozen betaalmethode

  // Stel een vaste prijs per reservering in (€20 per reservering)
  const pricePerReservation = 20;

  // Bereken het totaal aantal reserveringen
  const totalReservations = Object.keys(selectedTimes).length;

  // Bereken de totale prijs
  const totalPrice = totalReservations * pricePerReservation;

  useEffect(() => {
    console.log('Geselecteerde tijden:', selectedTimes);
  }, [selectedTimes]);

  // Simuleer betaling
  const handlePayment = () => {
    if (!paymentMethod) {
      Alert.alert('Fout', 'Kies eerst een betaalmethode!');
      return;
    }

    Alert.alert(
      'Betaling voltooid!',
      `Je hebt €${totalPrice} betaald via ${paymentMethod}.`,
      [{ text: 'OK', onPress: () => console.log('Betaling bevestigd') }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Betalingspagina</Text>
      <Text style={styles.info}>Je hebt de volgende dagen geselecteerd:</Text>

      {Object.keys(selectedTimes).map((date) => (
        <Text key={date} style={styles.reservationText}>
          {date}: {selectedTimes[date]}
        </Text>
      ))}

      {/* Toon het aantal reservaties en het totaalbedrag */}
      <Text style={styles.summary}>
        Aantal reserveringen: {totalReservations}
      </Text>
      <Text style={styles.summary}>
        Totaalprijs: €{totalPrice}
      </Text>

      {/* Picker voor betaalmethoden */}
      <Text style={styles.label}>Kies een betaalmethode:</Text>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecteer een betaalmethode..." value="" />
        <Picker.Item label="iDEAL" value="iDEAL" />
        <Picker.Item label="Creditcard" value="Creditcard" />
        <Picker.Item label="PayPal" value="PayPal" />
        <Picker.Item label="Bancontact" value="Bancontact" />
      </Picker>

      {/* Betaal knop */}
      <Pressable style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Betalen</Text>
      </Pressable>
    </View>
  );
}

// ** Stijlen **
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  reservationText: {
    fontSize: 16,
    marginBottom: 5,
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
    backgroundColor: 'white',
    borderRadius: 5,
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
