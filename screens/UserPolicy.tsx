import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { navigate } from '../helpers/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Kabien() {
  const items = [
    { title: 'Onboarding', screen: 'Onboarding', icon: 'information-circle-outline'},
    { title: 'Tijdbeheer', screen: 'Tijdbeheer', icon: 'time-outline' },
    // Voeg hier meer knoppen toe indien nodig
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Instellingen en activiteit</Text>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={styles.button}
          onPress={() => navigate(item.screen)}
        >
         <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>{item.title}</Text>
            <Ionicons name={item.icon} size={20} color="#232323" style={styles.icon} />
         </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  header: {
    padding: 20,
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Poppins_500Medium',
  },
  button: {
    width: "100%",
    borderBottomWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    marginVertical: 15,
  },
  buttonText: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    color: '#232323',
    fontSize: 16,
    textAlign: 'left',
    fontFamily: 'Poppins_400Regular',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    //marginRight: -10,
    fontSize: 20,
    color: '#232323'
  },
});