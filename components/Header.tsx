import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';


export default function Header(props: any) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Kabien</Text>
      <Text style={styles.slogan}>Wil jij een cabine? Kom dan bij Kabien! </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#987653',
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
      marginTop: 15,
       fontWeight: 500,
       fontSize: 25,
       color: 'white',

  },
    slogan: {
       marginTop: 8,
       fontSize: 20,
       color: 'white',
  },
});