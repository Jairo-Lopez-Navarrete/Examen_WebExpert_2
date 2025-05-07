import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, RefreshControl, PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Calendar } from 'react-native-calendars';

export default function CalendarPage({ navigation }) {
  const [location, setLocation] = useState(null);
  const [selected, setSelected] = useState('');
  const [selectedTimes, setSelectedTimes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTimes, setActiveTimes] = useState({});
  const [reservedSlots, setReservedSlots] = useState({});
  const isReserved = (time) => reservedSlots[selected]?.includes(time);




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
        data.forEach(({ date, time }) => {
          if (!slots[date]) slots[date] = [];
          slots[date].push(time);
        });
        setReservedSlots(slots);
      })
      .catch(err => console.error('Fout bij ophalen reserveringen:', err));
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSelected('');
    setSelectedTimes({});
    setActiveTimes({});
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleTimeSelection = (timeLabel) => {
    const reserved = reservedSlots[selected]?.includes(timeLabel);
    if (reserved) {
      Alert.alert('Tijdslot bezet', 'Dit tijdslot is al gereserveerd.');
      return;
    }

    setSelectedTimes((prev) => ({
      ...prev,
      [selected]: prev[selected] === timeLabel ? null : timeLabel,
    }));

    setActiveTimes((prev) => ({
      ...prev,
      [selected]: {
        Ochtend: false,
        Middag: false,
        Avond: false,
        [timeLabel]: !(prev[selected]?.[timeLabel] || false),
      },
    }));

    fetch('http://192.168.156.35:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',
        reservations: { [selected]: timeLabel },
      }),
    })
      .then(response => response.json())
      .then(data => console.log('Reservering succesvol opgeslagen:', data))
      .catch(error => console.error('Fout bij opslaan reservering:', error));
  };

  const getMarkedDates = () => {
    const markedDates = {};
    Object.keys(selectedTimes).forEach((date) => {
      markedDates[date] = {
        selected: true,
        marked: true,
        selectedColor: 'blue',
        selectedTextColor: 'white',
        dotColor: 'white',
      };
    });
    return markedDates;
  };

  const handleNavigateToPayment = () => {
    if (Object.keys(selectedTimes).length === 0) {
      Alert.alert('Waarschuwing', 'Je hebt geen dagen geselecteerd.');
    } else {
      navigation.navigate('PaymentPage', { selectedTimes });
    }
  };

  const handleDaySelect = (day) => {
    setSelected(day.dateString);
    const time = selectedTimes[day.dateString];
    setActiveTimes((prev) => ({
      ...prev,
      [day.dateString]: {
        Ochtend: time === 'Ochtend',
        Middag: time === 'Middag',
        Avond: time === 'Avond',
      },
    }));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Calendar
          style={styles.calendarStyle}
          onDayPress={(day) => handleDaySelect(day)}
          markedDates={getMarkedDates()}
          theme={{
            todayTextColor: '#000',
            arrowColor: '#2b4570',
          }}
        />
        {selected && (
          <View style={styles.timeSelectionContainer}>
            <Text style={styles.timeSelectionText}>Kies een dagdeel voor {selected}:</Text>
            <Pressable
              onPress={() => handleTimeSelection('Ochtend')} disabled={isReserved('Ochtend')}
              style={[styles.timeButton, activeTimes['Ochtend'] && styles.timeButtonActive, isReserved('Ochtend') && styles.timeButtonDisabled]}
            >
              <Text style={styles.timeButtonText}>Ochtend</Text>
            </Pressable>
            <Pressable
              onPress={() => handleTimeSelection('Middag')} disabled={isReserved('Middag')}
              style={[styles.timeButton, activeTimes['Middag'] && styles.timeButtonActive, isReserved('Middag') && styles.timeButtonDisabled]}
            >
              <Text style={styles.timeButtonText}>Middag</Text>
            </Pressable>
            <Pressable
              onPress={() => handleTimeSelection('Avond')} disabled={isReserved('Avond')}
              style={[styles.timeButton, activeTimes['Avond'] && styles.timeButtonActive, isReserved('Avond') && styles.timeButtonDisabled]}
            >
              <Text style={styles.timeButtonText}>Avond</Text>
            </Pressable>
          </View>
        )}
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
  timeSelectionContainer: {
    marginBottom: '5%',
    padding: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  timeSelectionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  timeButton: {
    backgroundColor: '#2B4570',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#628395',
  },
  timeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
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