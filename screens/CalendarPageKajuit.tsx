import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Calendar } from 'react-native-calendars';

export default function CalendarPage({ navigation }) {
  const [location, setLocation] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [reservedSlots, setReservedSlots] = useState({});



  useEffect(() => {
      requestLocationPermissionAndFetchLocation();
    }, []);
    
    const requestLocationPermissionAndFetchLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Locatietoegang nodig',
              message: 'Deze app heeft toegang nodig tot je locatie om correct te functioneren.',
              buttonNeutral: 'Vraag later',
              buttonNegative: 'Annuleren',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Locatietoegang geweigerd');
            return;
          }
        }
    
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Toestemming geweigerd voor foreground');
          return;
        }
    
        const location = await Location.getCurrentPositionAsync({});
        console.log('Opgehaalde locatie:', location);
        
        if (location?.coords) {
          setLocation(location.coords);
        } else {
          console.warn('Geen coordinaten gevonden in locatie object');
        }
      } catch (error) {
        console.error('Fout bij ophalen locatie:', error);
      }
    };
    
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Geen toestemming', 'Locatietoegang is vereist om je locatie te tonen.');
          return;
        }
    
        const location = await Location.getCurrentPositionAsync({});
        console.log('Handmatig opgehaalde locatie:', location);
    
        if (location?.coords) {
          setLocation(location.coords);
        } else {
          console.warn('Geen coordinaten gevonden bij handmatige opvraag');
        }
      } catch (error) {
        console.error('Fout bij handmatig ophalen locatie:', error);
      }
    };

  useEffect(() => {
    fetch('http://192.168.156.35:3000/reservations')
      .then(res => res.json())
      .then(data => {
        const slots = {};
        data.forEach(({ date }) => {
          slots[date] = true;
        });
        setReservedSlots(slots);
      })
      .catch(err => console.error('Fout bij ophalen reserveringen:', err));
  }, []);

  const handleDaySelect = (day) => {
    const date = day.dateString;

    if (reservedSlots[date]) {
      Alert.alert('Dag bezet', 'Deze dag is al gereserveerd.');
      return;
    }

    setSelectedTimes((prev) => {
      const updated = { ...prev };
      if (updated[date]) {
        delete updated[date];
      } else {
        updated[date] = 'Volledige dag';
      }
      return updated;
    });
  };

  const handleNavigateToPayment = () => {
    if (Object.keys(selectedTimes).length === 0) {
      Alert.alert('Waarschuwing', 'Je hebt geen dagen geselecteerd.');
      return;
    }
    navigation.navigate('PaymentPage', { selectedTimes, type: 'Kajuit' });
  };

  const getMarkedDates = () => {
    const marked = {};

    Object.keys(reservedSlots).forEach(date => {
      marked[date] = { marked: true, dotColor: 'red' };
    });

    Object.keys(selectedTimes).forEach(date => {
      marked[date] = {
        selected: true,
        selectedColor: 'blue',
        selectedTextColor: 'white',
      };
    });

    return marked;
  };

  return (
    <ScrollView style={styles.body}>
      <View style={styles.container}>
        <Calendar
          style={styles.calendarStyle}
          onDayPress={handleDaySelect}
          markedDates={getMarkedDates()}
          minDate={new Date().toISOString().split('T')[0]}
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
  body: {
    backgroundColor: "#fff"
  },
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