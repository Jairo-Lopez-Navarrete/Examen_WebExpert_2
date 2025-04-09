import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl, Pressable  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AboutUs() {
  const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Over Ons</Text>
      
      <Text style={styles.paragraph}>Welkom bij onze app! Wij zijn een toegewijd team dat zich richt op het leveren van de beste gebruikerservaring. Onze missie is om...</Text>
      
      <Text style={styles.paragraph}>We geloven in kwaliteit, betrouwbaarheid en innovatie. Sinds onze oprichting in [jaartal], hebben we...</Text>

      <Text style={styles.subtitle}>Ons Team</Text>
      <Text style={styles.paragraph}>Ons team bestaat uit een diverse groep professionals die werken aan het verbeteren van onze applicatie en het toevoegen van nieuwe functies.</Text>
      <Text style={styles.subtitle}>Onze Missie</Text>
      <Text style={styles.paragraph}>Onze missie is om [specifieke missie van het bedrijf of de app]. We streven ernaar om gebruikers te helpen hun doelen te bereiken door...</Text>
      <Text style={styles.subtitle}>Neem contact met ons op</Text>
      <Text style={styles.paragraph}>Voor vragen of feedback, aarzel dan niet om contact met ons op te nemen.</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('ContactPage')}><Text style={styles.buttonText}>Contacteer ons</Text></Pressable>
      </View>
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
  button: {
    backgroundColor: '#E74040',
        padding: 15,
        marginTop: 0,
        margin: 15,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10
  }
});