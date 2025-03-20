import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Calendar } from 'react-native-calendars';

export default function CalendarPage() {
  const [location, setLocation] = useState(null);
  const [selected, setSelected] = useState('');
  const [selectedTimes, setSelectedTimes] = useState({});

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
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
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Locatietoegang verleend');
      } else {
        console.log('Locatietoegang geweigerd');
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setLocation(position.coords);
      },
      (error) => {
        console.error(error);
        Alert.alert('Fout', 'Kon locatie niet ophalen. Controleer je instellingen.');
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  };

  const handleTimeSelection = (time) => {
    // Controleer of het geselecteerde dagdeel al bestaat
    if (selectedTimes[selected] === time) {
      // Als het dagdeel al geselecteerd is, verwijder het
      setSelectedTimes((prevTimes) => {
        const newTimes = { ...prevTimes };
        delete newTimes[selected]; // Verwijder het geselecteerde dagdeel voor deze datum
        return newTimes;
      });
    } else {
      // Anders, sla het geselecteerde dagdeel op
      setSelectedTimes((prevTimes) => ({
        ...prevTimes,
        [selected]: time, // Voeg het nieuwe dagdeel toe voor de geselecteerde datum
      }));
    }
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.viewChange}>
          <Text style={styles.textChange}>Locatiegegevens:</Text>
          {location ? (
            <Text>Latitude: {location.latitude}, Longitude: {location.longitude}</Text>
          ) : (
            <Text>Nog geen locatie opgehaald.</Text>
          )}
          <Pressable onPress={getLocation}>
            <Text>Haal locatie op</Text>
          </Pressable>
        </View>

        <Calendar
          style={styles.calendarStyle}
          onDayPress={(day) => {
            setSelected(day.dateString); // Stel de geselecteerde dag in
          }}
          markedDates={getMarkedDates()} // Markeer de geselecteerde dagen
          theme={{
            todayTextColor: 'red',
            arrowColor: 'blue',
          }}
        />

        {selected && !selectedTimes[selected] && (
          <View style={styles.timeSelectionContainer}>
            <Text style={styles.timeSelectionText}>Kies een dagdeel voor {selected}:</Text>
            <Pressable onPress={() => handleTimeSelection('s morgens')} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>S Morgens</Text>
            </Pressable>
            <Pressable onPress={() => handleTimeSelection('s middags')} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>S Middags</Text>
            </Pressable>
            <Pressable onPress={() => handleTimeSelection('s avonds')} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>S Avonds</Text>
            </Pressable>
          </View>
        )}

        {selectedTimes[selected] && (
          <View style={styles.selectionConfirmation}>
            <Text style={styles.confirmationText}>
              Je hebt {selected} geselecteerd en gekozen voor {selectedTimes[selected]}.
            </Text>
          </View>
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
  viewChange: {
    padding: 20,
  },
  textChange: {
    fontSize: 18,
    marginBottom: 10,
  },
  calendarStyle: {
    height: '50%',
    width: '100%',
    marginTop: 20,
  },
  timeSelectionContainer: {
    marginTop: 20,
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
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectionConfirmation: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d1ffd6',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});