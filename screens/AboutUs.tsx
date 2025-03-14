import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function AboutUs() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/icon.png')} // Voeg je eigen logo hier toe
        style={styles.logo}
      />
      <Text style={styles.title}>Over Ons</Text>
      
      <Text style={styles.paragraph}>
        Welkom bij onze app! Wij zijn een toegewijd team dat zich richt op het leveren van de beste gebruikerservaring. Onze missie is om...
      </Text>
      
      <Text style={styles.paragraph}>
        We geloven in kwaliteit, betrouwbaarheid en innovatie. Sinds onze oprichting in [jaartal], hebben we...
      </Text>

      <Text style={styles.subtitle}>Ons Team</Text>
      <Text style={styles.paragraph}>
        Ons team bestaat uit een diverse groep professionals die werken aan het verbeteren van onze applicatie en het toevoegen van nieuwe functies.
      </Text>

      <Text style={styles.subtitle}>Onze Missie</Text>
      <Text style={styles.paragraph}>
        Onze missie is om [specifieke missie van het bedrijf of de app]. We streven ernaar om gebruikers te helpen hun doelen te bereiken door...
      </Text>
      
      <Text style={styles.subtitle}>Neem contact met ons op</Text>
      <Text style={styles.paragraph}>
        Voor vragen of feedback, aarzel dan niet om contact met ons op te nemen via [e-mail, telefoonnummer, etc.].
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 15,
  },
});