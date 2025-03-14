import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service'
import {Calendar} from 'react-native-calendars';

export default function CalendarPage(){
    const [location, setLocation] = useState(null);
    const [selected, setSelected] = useState('');

    useEffect(() => {
        requestLocationPermission();
    })

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
    
      // Functie om de huidige locatie op te halen
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
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      };

    return(
       <View style={styles.container}>
        <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Locatiegegevens:</Text>
      {location ? (
        <Text>Latitude: {location.latitude}, Longitude: {location.longitude}</Text>
      ) : (
        <Text>Nog geen locatie opgehaald.</Text>
      )}
      <Pressable title="Haal locatie op" onPress={getLocation} />
    </View>
            <Calendar style={styles.calendarStyle} onDayPress={(day) => setSelected(day.datestring)} markedDates={{[selected]: {selected: true, marked: true, selectedColor: 'blue'}}} theme={{todayTextColor: 'red', arrowColor: 'blue'}}/>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center'
    },
    calendarStyle: {
        height: '100%',
        width: '100%'
    }
});