import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';


export default function Header(props: any) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Karveel</Text>
      <Text style={styles.slogan}>Ontmoet Kapitan en ontdek onze ruimtes in het karveel! </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#987653',
        width: '100%',
        height: 140,
        padding: 20,
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
      textAlign: 'center',
       marginTop: 8,
       fontSize: 20,
       paddingLeft: 20,
       paddingRight: 20,
       color: 'white',
  },
});