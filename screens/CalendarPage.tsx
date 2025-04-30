import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, PermissionsAndroid, Platform, ScrollView, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import { Calendar } from 'react-native-calendars';

export default function CalendarPage({ navigation }) {
  const [location, setLocation] = useState(null);
  const [selected, setSelected] = useState('');
  const [selectedTimes, setSelectedTimes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTimes, setActiveTimes] = useState({});
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setSelected('');
    setSelectedTimes('');
    setActiveTimes('');

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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

  const handleTimeSelection = (time) => {
    const updatedActiveTimes = { ...activeTimes };

    // Als de tijd al geselecteerd is, deactiveer deze
    if (updatedActiveTimes[time]) {
      updatedActiveTimes[time] = false;
      delete selectedTimes[selected];  // Verwijder de geselecteerde tijd voor deze dag
    } else {
      
      updatedActiveTimes['Ochtend'] = false;
      updatedActiveTimes['Middag'] = false;
      updatedActiveTimes['Avond'] = false;
      updatedActiveTimes[time] = true;
      
      setSelectedTimes((prevTimes) => ({
        ...prevTimes,
        [selected]: time
      }));
    }

    setActiveTimes(updatedActiveTimes);
  };

  const getMarkedDates = () => {
    const markedDates = {};
    Object.keys(selectedTimes).forEach((date) => {
      markedDates[date] = {
        selected: true,
        marked: true,
        selectedColor: 'blue',
        selectedTextColor: 'white',
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

    setActiveTimes({
      'Ochtend': false,
      'Middag': false,
      'Avond': false,
    });

    // Als deze dag al eerder is geselecteerd, stel de actieve tijden in
    if (selectedTimes[day.dateString]) {
      const selectedDayTime = selectedTimes[day.dateString];
      const updatedActiveTimes = { ...activeTimes };
      updatedActiveTimes[selectedDayTime] = true;
      setActiveTimes(updatedActiveTimes);
    }
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        {/* <View style={styles.viewChange}>
          <Text style={styles.textChange}>Locatiegegevens:</Text>
          {location ? (<Text>Latitude: {location.latitude}, Longitude: {location.longitude}</Text>) : (<Text>Locatie wordt opgehaald of nog niet beschikbaar.</Text>)}
          <Pressable onPress={getLocation}>
            <Text>Haal locatie op</Text>
          </Pressable>
        </View> */}

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
              onPress={() => handleTimeSelection('s morgens')}
              style={[styles.timeButton, activeTimes['s morgens'] && styles.timeButtonActive]}
            >
              <Text style={styles.timeButtonText}>Ochtend</Text>
            </Pressable>
            <Pressable
              onPress={() => handleTimeSelection('s middags')}
              style={[styles.timeButton, activeTimes['s middags'] && styles.timeButtonActive]}
            >
              <Text style={styles.timeButtonText}>Middag</Text>
            </Pressable>
            <Pressable
              onPress={() => handleTimeSelection('s avonds')}
              style={[styles.timeButton, activeTimes['s avonds'] && styles.timeButtonActive]}
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
  viewChange: {
    padding: 20,
  },
  textChange: {
    fontSize: 18,
    marginBottom: 10,
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
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectionConfirmation: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#caf0f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    fontWeight: 'bold',
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