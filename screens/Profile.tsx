import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Profile(){
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle" style={styles.icon}/>
      <Text style={styles.text}>Jairo Lopez Navarrete</Text>
      <Text style={styles.text}>26/12/2000</Text>
      <Text style={styles.text}>Working at Kapitan!</Text>

      <Pressable style={styles.button}>
            <Text style={styles.changeText}> Change Profile </Text>
      </Pressable>
      <Pressable >
            <Text style={styles.deleteText}> Delete Profile </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  icon: {
    fontSize: 100,
    color: '#ADA48C',
  },
  text: {
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10,
    color: '#232323'
  },
  button: {
    backgroundColor: '#987653',
    padding: 20,
    borderRadius: 15,
    margin: 20
  },
  changeText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#fff'
  },
  deleteText: {
    
  }
});