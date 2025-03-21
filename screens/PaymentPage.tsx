import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PaymentPage({ route }) {
  const { selectedTimes } = route.params; // Ontvang de geselecteerde dagen en tijden

  useEffect(() => {
    console.log('Geselecteerde tijden:', selectedTimes);
  }, [selectedTimes]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Betalingspagina moet nog gemaakt worden</Text>
      <Text style={styles.info}>Je hebt de volgende dagen geselecteerd:</Text>
      {Object.keys(selectedTimes).map((date) => (
        <Text key={date}>
          {date}: {selectedTimes[date]}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});