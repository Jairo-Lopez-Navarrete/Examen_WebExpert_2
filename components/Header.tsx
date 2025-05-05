import React from 'react';
import {StyleSheet, Text, View } from 'react-native';


export default function Header(props: any) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Karveel</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2b4570',
        width: '100%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
      marginTop: 15,
       fontWeight: 500,
       fontSize: 25,
       color: 'white',
       fontFamily: 'Poppins_500Medium',

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