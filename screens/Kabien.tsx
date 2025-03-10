import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, TouchableOpacity, ScrollView} from 'react-native';
//import {navigate} from '../helpers/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Kabien(){


    const [modalVisible, setModalVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <ScrollView>
        <View style={styles.container}>
        <Text style={styles.text}>Het wordt dus Kabien!</Text>
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
        <Text style={styles.text}>Wat je GRATIS krijgt van ons.</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
/*textContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden'
    },*/
  container: {
    flex: 1,
    //justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    flexWrap: 'wrap',

  },
  /*imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },*/
  image: {
    width: '95%',
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
  }
});