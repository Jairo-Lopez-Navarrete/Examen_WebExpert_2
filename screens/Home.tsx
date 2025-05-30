import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, useWindowDimensions, ScrollView, RefreshControl } from 'react-native';
import {navigate} from '../helpers/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';


import Header from '../components/Header';

export default function Home(){
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
      <Header />
        <Text style={styles.text}>De Kabien geeft plek aan 8 personen en wordt vooral gebruikt als vergaderruimte.{'\n'}{'\n'}
             Ben je op zoek naar een flex office, dan ben je in onze Kajuit op de juiste plek.
        </Text>
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
    </ScrollView>
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
    overflow: 'hidden',
    },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 25,
    
    marginTop: '15%',
    marginBottom: 2,
    justifyContent: 'center',
    fontFamily: 'Poppins_500Medium',
    color: '#232323',
    padding: 5,
  },
  text: {
    fontSize: 15,
    
    marginVertical: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    color: '#232323',
    paddingHorizontal: 25,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  image: {
    width: 170,
    height: 250,
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
    fontFamily: 'Poppins_500Medium',
  },
  icon: {
    fontSize: 17,
  },
});