import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, TouchableOpacity, ScrollView, Share, RefreshControl, FlatList} from 'react-native';
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
          message: 'Check deze geweldige werkplek: Kabien! Een groot lokaal voor 8 personen, Wifi, Keukenfaciliteiten en meer. Perfect voor freelancers en bedrijven!\n\n Bekijk de details hier: https://jouwwebsite.com/kabien',
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
        require('../assets/TestPic3.jpg'),
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
        ["Ruime werkplek ", "Wifi"],
        ["Opbergruimte ", "Warme dranken & water"],
        ["Keukenfaciliteiten ", "Terras"],
        ["Toilet ", "Douche (voor fietsers)"],
        ["Stroomverbruik & verzekering"],
        ["Catering opties"],
        ["Bereikbaarheid"]
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
            {/* Titel + Share */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Het wordt dus Kabien!</Text>
              <TouchableOpacity onPress={shareInfo}>
                <Ionicons name="arrow-redo" style={styles.iconShare} />
              </TouchableOpacity>
            </View>
    
            {/* Hoofdafbeelding */}
            <Image source={require('../assets/TestPic4.png')} style={styles.image} />
    
            {/* Kleine afbeeldingen */}
            <View style={styles.imageSmallContainer}>
              {images.map((image, index) => (
                <Pressable key={index} onPress={() => openModal(index)}>
                  <Image source={image} style={styles.imageSmall} />
                </Pressable>
              ))}
            </View>
    
            {/* Afbeelding Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-circle" size={40} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.prevButton} onPress={() =>
                  setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}>
                  <Ionicons name="chevron-back-circle" size={50} color="white" />
                </TouchableOpacity>
                <Image source={images[currentImageIndex]} style={styles.fullImage} />
                <TouchableOpacity style={styles.nextButton} onPress={() =>
                  setCurrentImageIndex((prev) => (prev + 1) % images.length)}>
                  <Ionicons name="chevron-forward-circle" size={50} color="white" />
                </TouchableOpacity>
              </View>
            </Modal>
    
            {/* Prijs */}
            <Text style={styles.money}>€100 per dag</Text>
    
            {/* Wat inbegrepen */}
            <Text style={styles.titles}>Dit is wat je krijgt</Text>
            <FlatList
              data={included}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.text}>• {item}</Text>}
            />
    
            {/* Niet inbegrepen */}
            <Text style={styles.titles}>Niet inbegrepen</Text>
            <FlatList
              data={notIncluded}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.text}>• {item}</Text>}
            />
    
            {/* Kalenderknop */}
            <TouchableOpacity style={styles.calenderButton} onPress={handleCalendarPress}>
              <Ionicons name="calendar-outline" size={26} color="white" />
              <Text style={styles.buttonText}>Dit is wat ik wil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 25,
    color: '#232323',
    fontFamily: 'Poppins_500Medium',
  },
  iconShare: {
    fontSize: 25,
    marginLeft: 10,
    color: '#628395',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginVertical: 10,
  },
  imageSmallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  imageSmall: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  closeButton: { position: 'absolute', top: 40, right: 20 },
  prevButton: { position: 'absolute', left: 20, top: '50%', zIndex: 1 },
  nextButton: { position: 'absolute', right: 20, top: '50%', zIndex: 1 },
  money: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'Poppins_500Medium',
  },
  titles: {
    fontSize: 20,
    color: '#232323',
    marginTop: 15,
    marginBottom: 5,
    fontFamily: 'Poppins_500Medium',
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
    fontFamily: 'Poppins_400Regular',
  },
  calenderButton: {
    backgroundColor: '#E74040',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
    fontFamily: 'Poppins_500Medium',
  },
});