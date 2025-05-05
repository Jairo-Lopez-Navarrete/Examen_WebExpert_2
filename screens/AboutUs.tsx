import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl, Pressable  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';

export default function AboutUs() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const slideAnimation = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        
        <Animated.Text style={[styles.title, { transform: [{ translateX: slideAnimation }] }]}>
          Wij zijn Kapitan!
        </Animated.Text>

       
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            We zijn geen reclamebureau en ook geen freelancers, maar iets daartussen.
          </Text>
          <Text style={styles.paragraph}>
            Kapitan ondersteunt marketeers in de uitvoering van hun merkplannen...
          </Text>
        </View>

        
        <View style={[styles.section, styles.highlightSection]}>
          <Text style={styles.subtitle}>Maak kennis met El Kapitan</Text>
          <View style={styles.workerContainer}>
            <Image source={require('../assets/Guido.png')} style={styles.workerImage} />
            <Text style={styles.titleInformation}>Guido Evens</Text>
            <Text style={styles.workerInformation}>Chief Merkwerker</Text>
          </View>
        </View>

        
        <View style={[styles.section]}>
          <Text style={styles.subtitle}>De core merkwerkers</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {[
              {
                image: require('../assets/David.png'),
                name: 'David Cruz-Martinez',
                role: 'Technology Wizard',
              },
              {
                image: require('../assets/Ann_3D_Cartoon.png'),
                name: 'Ann Winderickx',
                role: 'Art Director',
              },
              {
                image: require('../assets/Gunter.png'),
                name: 'Gunter Flossie',
                role: 'Studio Manager',
              },
            ].map((worker, index) => (
              <View style={styles.workerCard} key={index}>
                <Image source={worker.image} style={styles.workerImage} />
                <Text style={styles.titleInformation}>{worker.name}</Text>
                <Text style={styles.workerInformation}>{worker.role}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        
        <View style={[styles.section, styles.highlightSection2]}>
          <Text style={styles.subtitle}>Onze Missie</Text>
          <Text style={styles.paragraph}>
            Onze missie is om ... te realiseren...
          </Text>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.subtitle}>Neem contact met ons op</Text>
          <Text style={styles.paragraph}>
            Voor vragen of feedback, aarzel dan niet om contact met ons op te nemen.
          </Text>
          <Pressable style={styles.button} onPress={() => navigation.navigate('ContactPage')}>
            <Text style={styles.buttonText}>Contacteer ons</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  section: {
    marginBottom: 30,
  },
  highlightSection: {
    // backgroundColor: '#fff',
    padding: 15,
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 1,
  },
  highlightSection2: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555',
    fontFamily: 'Poppins_500Medium',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
  workerContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  workerCard: {
    width: 200,
    alignItems: 'center',
    marginRight: 15,
    // backgroundColor: '#fff',
    // borderRadius: 12,
    padding: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  workerImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 10,
  },
  titleInformation: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  workerInformation: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    textAlign: 'center',
  },
  carouselContainer: {
    paddingVertical: 10,
    paddingLeft: 5,
  },
  button: {
    backgroundColor: '#E74040',
    padding: 15,
    marginTop: 10,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins_500Medium',
  },
});