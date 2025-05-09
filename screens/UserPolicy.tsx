import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { navigate } from '../helpers/RootNavigation';

export default function Kabien() {
  const items = [
    { title: 'Onboarding', screen: 'Onboarding' },
    { title: 'Tijdbeheer', screen: 'Tijdbeheer' },
    // Voeg hier meer knoppen toe indien nodig
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Gebruikersinstellingen</Text>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={styles.button}
          onPress={() => navigate(item.screen)}
        >
          <Text style={styles.buttonText}>{item.title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});