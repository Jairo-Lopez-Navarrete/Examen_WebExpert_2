import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, PermissionsAndroid, Platform, ScrollView, RefreshControl } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Calendar } from 'react-native-calendars';

export default function CalendarPage({ navigation }) {
  const [location, setLocation] = useState(null);
  const [selected, setSelected] = useState('');
  const [selectedTimes, setSelectedTimes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
    

      const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);

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
        console.error('Error getting location: ', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleTimeSelection = (time) => {
    if (selectedTimes[selected] === time) {
      setSelectedTimes((prevTimes) => {
        const newTimes = { ...prevTimes };
        delete newTimes[selected];
        return newTimes;
      });
    } else {
      setSelectedTimes((prevTimes) => ({
        ...prevTimes,
        [selected]: time,
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

  const handleNavigateToPayment = () => {
    if (Object.keys(selectedTimes).length === 0) {
      Alert.alert('Waarschuwing', 'Je hebt geen dagen geselecteerd.');
    } else {
      navigation.navigate('PaymentPage', { selectedTimes });
    }
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
            setSelected(day.dateString);
          }}
          markedDates={getMarkedDates()}
          theme={{
            todayTextColor: 'red',
            arrowColor: 'blue',
          }}
        />

        {selected && !selectedTimes[selected] && (
          <View style={styles.timeSelectionContainer}>
            <Text style={styles.timeSelectionText}>Kies een dagdeel voor {selected}:</Text>
            <Pressable onPress={() => handleTimeSelection('s morgens')} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>Ochtend</Text>
            </Pressable>
            <Pressable onPress={() => handleTimeSelection('s middags')} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>Middag</Text>
            </Pressable>
            <Pressable onPress={() => handleTimeSelection('s avonds')} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>Avond</Text>
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
      // height: '50%',
      width: '100%',
      marginTop: '5%',
      marginBottom: '5%'
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
    paymentButton: {
      backgroundColor: '#be5845',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    paymentButtonText: {
      color: 'white',
      fontSize: 18,
    },
});