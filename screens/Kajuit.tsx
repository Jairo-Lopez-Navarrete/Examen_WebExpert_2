import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, TouchableOpacity, ScrollView, Share, RefreshControl} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {navigate} from '../helpers/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Kabien(){
    const [modalVisible, setModalVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
          
            const onRefresh = useCallback(() => {
              setRefreshing(true);
              setTimeout(() => {
                setRefreshing(false);
              }, 2000);
            }, []);
    

    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const user = await AsyncStorage.getItem('user');
          if (user) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Fout bij het ophalen van gebruikersgegevens:', error);
          setIsLoggedIn(false);
        }
      };
  
      checkLoginStatus();
    }, []);
  
    const handleCalendarPress = () => {
      if (isLoggedIn) {
        navigate('CalendarPage');
      } else {
        navigate('Login');
      }
    };

    const shareInfo = async () => {
          try {
            const result = await Share.share({
              message: 'Check deze geweldige werkplek: Kajuit! Ruime werkplek, Wifi, Keukenfaciliteiten en meer. Perfect voor freelancers en bedrijven!\n\n Bekijk de details hier: https://jouwwebsite.com/kajuit',
            });
        
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                console.log('Gedeeld via: ', result.activityType);
              } else {
                console.log('Deel actie werd uitgevoerd.');
              }
            } else if (result.action === Share.dismissedAction) {
              console.log('Deel actie werd geannuleerd.');
            }
          } catch (error) {
            console.error('Fout bij delen:', error);
          }
        };

    const images = [
        require('../assets/TestPic1.png'),
        require('../assets/TestPic2.png'),
        require('../assets/TestPic3.jpg')
    ];

    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const included = [
        ["Ruime bureau in de studio ", "tussen de medewerkers"],
        ["Opbergruimte ", "Warme dranken & water"],
        ["Keukenfaciliteiten ", "Terras"],
        ["Toilet ", "Douche (voor fietsers)"],
        ["Stroomverbruik & verzekering"],
        ["Bereikbaarheid"],
        ["Douche aanwezig (voor fietsers)"]
    ]

    const notIncluded = [
        ["Sleutel"],
        ["Frisdrank & printer"],
        ["Ruime parkeermogelijkheden"],
        ["Postadres & IT-support"],
        ["Ongevallenverzekering"],
    ]
  
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.text}>Het wordt dus Kajuit!</Text>
            <TouchableOpacity onPress={shareInfo}>
                <Ionicons name="arrow-redo" style={styles.iconShare}/>
            </TouchableOpacity>
        </View>
        <Image source={require('../assets/TestPic4.png')} style={styles.image}/>
        <View style={styles.imageSmallContainer}>
            {images.map((image, index) =>(
                 <Pressable key={index} onPress={() => openModal(index)}>
                 <Image source={image} style={styles.imageSmall}/>
             </Pressable>
            ))}
        </View>

        <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Ionicons name="close-circle" size={40} color="white"/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.prevButton} onPress={prevImage}>
                    <Ionicons name="chevron-back-circle" size={50} color="white" />
                </TouchableOpacity>

                <Image source={images[currentImageIndex]} style={styles.fullImage}/>

                <TouchableOpacity style={styles.nextButton} onPress={nextImage}>
                    <Ionicons name="chevron-forward-circle" size={50} color="white" />
                </TouchableOpacity>
            </View>
        </Modal>
        <Text style={styles.text}>Dit is wat je krijgt.</Text>
        <View style={styles.textContainer}>
            <Text>{included[0]}</Text>
            <Text>{included[1]}</Text>
            <Text>{included[2]}</Text>
            <Text>{included[3]}</Text>
            <Text>{included[4]}</Text>
            <Text>{included[5]}</Text>
            <Text>{included[6]}</Text>
        </View>
        <Text style={styles.text}>Niet inbegrepen</Text>
        <View style={styles.textContainer}>
            <Text>{notIncluded[0]}</Text>
            <Text>{notIncluded[1]}</Text>
            <Text>{notIncluded[2]}</Text>
            <Text>{notIncluded[3]}</Text>
            <Text>{notIncluded[4]}</Text>
        </View>
   </View>
   <View>
   <TouchableOpacity style={styles.calenderButton} onPress={handleCalendarPress}>
                <Ionicons name="calendar-outline" size={30} color="white" />
                <Text style={styles.buttonText}>Dit is wat ik wil</Text>
   </TouchableOpacity>
   </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    padding: 30,
    // alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconShare: {
    fontSize: 25,
    marginLeft: 10,
    marginRight: 10,
    color: '#628395'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232323',
    padding: 5,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 350,
    flexWrap: 'wrap',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    margin: 5,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  imageSmallContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  imageSmall: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 6.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  prevButton: {
    position: 'absolute',
    left: 20,
    top: '50%',
  },
  nextButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
  },
  icon: {
    //zINdex: 5,
    //elevation: 5,
    fontSize: 17,
  },
  calenderButton: {
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