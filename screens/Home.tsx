import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, useWindowDimensions, ScrollView, RefreshControl } from 'react-native';
import {navigate} from '../helpers/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

 //components
import Header from '../components/Header';

export default function Home(){
  // const {width, height} = useWindowDimensions();
  // const isLandscape = width > height;
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
      {/* <Text style={[styles.text, isLandscape && styles.landscapeText]}>
        Dit is een {isLandscape ? 'landscape' : 'portrait'} scherm
      </Text> */}
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
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    // height: 70,
    marginTop: '20%',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#232323',
    padding: 5,
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
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 17,
  },


  // landscapeText: {
  //   fontSize: 24,
  // },
  // box: {
  //   width: 100,
  //   height: 100,
  //   backgroundColor: 'tomato',
  // },
  // landscapeBox: {
  //   width: 150,
  //   height: 150,
  // },
  // portraitBox: {
  //   width: 100,
  //   height: 100,
  // }
});