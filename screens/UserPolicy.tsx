import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function UserPolicy() {
  const navigation = useNavigation();
  const items = [
    { title: 'Onboarding', screen: 'Onboarding', icon: 'information-circle-outline'},
    
  ];

  return (
    <ScrollView>
      <Text style={styles.header}>Instellingen en activiteit</Text>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding')}
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
    fontSize: 20,
    color: '#232323'
  },
});