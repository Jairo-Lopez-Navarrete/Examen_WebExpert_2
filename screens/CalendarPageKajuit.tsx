import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, RefreshControl, PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Calendar } from 'react-native-calendars';

export default function CalendarPage({ navigation }) {
  const [location, setLocation] = useState(null);
  const [selected, setSelected] = useState({});  // Zorg ervoor dat selected een object is
  const [reservedSlots, setReservedSlots] = useState({});  // Zorg ervoor dat reservedSlots een object is
  const [refreshing, setRefreshing] = useState(false);

  // Haal de gereserveerde dagen op
  useEffect(() => {
    fetch('http://192.168.156.35:3000/reservations')
      .then(res => res.json())
      .then(data => {
        const slots = {};
        data.forEach(({ date }) => {
          slots[date] = true; // Markeer de volledige dag als gereserveerd
        });
        setReservedSlots(slots);  // Zorg ervoor dat reservedSlots altijd een object is
      })
      .catch(err => console.error('Fout bij ophalen reserveringen:', err));
  }, []);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 2000);
//   }, []);

  // Functie om geselecteerde dagen op te slaan
  const handleDaySelect = (day) => {
    const dayString = day.dateString;

    // Als de dag al gereserveerd is, kun je deze niet selecteren
    if (reservedSlots[dayString]) {
      Alert.alert('Dag bezet', 'Deze dag is al gereserveerd.');
      return;
    }

    // Als de dag al geselecteerd is, deselecteer deze
    setSelected((prevSelected) => {
      const updatedSelected = { ...prevSelected };
      if (updatedSelected[dayString]) {
        delete updatedSelected[dayString]; // Verwijder de geselecteerde dag
      } else {
        updatedSelected[dayString] = true; // Voeg de geselecteerde dag toe
      }
      return updatedSelected;
    });
  };

  // Markeer de dagen die gereserveerd zijn en geselecteerde dagen
  const getMarkedDates = () => {
    const markedDates = {};

    // Gereserveerde dagen markeren met een rode stip
    Object.keys(reservedSlots).forEach((date) => {
      markedDates[date] = {
        marked: true,
        dotColor: 'red', // Gereserveerde dagen krijgen een rode stip
      };
    });

    // Geselecteerde dagen markeren met blauw
    Object.keys(selected).forEach((date) => {
      markedDates[date] = {
        selected: true,
        selectedColor: 'blue', // Geselecteerde dagen worden blauw
        selectedTextColor: 'white',
      };
    });

    return markedDates;
  };

  const handleNavigateToPayment = () => {
    if (Object.keys(selected).length === 0) {
      Alert.alert('Waarschuwing', 'Je hebt geen dagen geselecteerd.');
    } else {
      navigation.navigate('PaymentPage', { selected });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Calendar
          style={styles.calendarStyle}
          onDayPress={handleDaySelect} // Handelt de dagselectie af
          markedDates={getMarkedDates()} // Markeer gereserveerde en geselecteerde dagen
          minDate={new Date().toISOString().split('T')[0]} // Voorkom dat gebruikers dagen in het verleden kunnen kiezen
          theme={{
            todayTextColor: '#000',
            arrowColor: '#2b4570',
          }}
        />

        <Pressable style={styles.paymentButton} onPress={handleNavigateToPayment}>
          <Text style={styles.paymentButtonText}>Ga naar Betalingspagina</Text>
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
  calendarStyle: {
    width: '100%',
    marginTop: '5%',
    marginBottom: '5%',
  },
  paymentButton: {
    backgroundColor: '#e74040',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});