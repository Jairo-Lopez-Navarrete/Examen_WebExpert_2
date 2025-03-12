import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import {Calendar} from 'react-native-calendars';

export default function CalendarPage(){
    const [selected, setSelected] = useState('');

    return(
       <View style={styles.container}>
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