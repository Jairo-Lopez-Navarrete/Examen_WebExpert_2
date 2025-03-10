import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageBackground } from 'react-native';
import {navigate} from '../helpers/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home(){
  
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Selecteer de cabine die je wilt!</Text>
        <View style={styles.imageContainer}>
            <Pressable onPress={() => navigate('Kabien')}>
                 <ImageBackground source={require('../assets/TestPic1.png')} style={styles.image} imageStyle={styles.imageBorder}>
                 <View style={styles.textContainer}>
                      <Text style={styles.imageText}>Kabien</Text>
                      <Text style={styles.imageText}>8 <Ionicons name="person" style={styles.icon}/></Text>
                 </View>
                 </ImageBackground>
            </Pressable>
            <Pressable onPress={() => navigate('Kajuit')}>
                 <ImageBackground source={require('../assets/TestPic2.png')} style={styles.image} imageStyle={styles.imageBorder}>
                 <View style={styles.textContainer}>
                      <Text style={styles.imageText}>Kajuit</Text>
                      <Text style={styles.imageText}>1 <Ionicons name="person" style={styles.icon}/></Text>
                 </View>
                 </ImageBackground>
            </Pressable>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
textContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden'
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232323',
    padding: 5,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  image: {
    width: 160,
    height: 210,
    margin: 5,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  imageBorder: {
    borderRadius: 10,
  },
  imageText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 17,
  }
});