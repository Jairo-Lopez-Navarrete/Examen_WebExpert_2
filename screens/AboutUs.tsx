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
      <Animated.Text style={[styles.title, {transform: [{translateX: slideAnimation}]}]}>Wij zijn Kapitan!</Animated.Text>
      
      <Text style={styles.paragraph}>We zijn geen reclamebureau en ook geen freelancers, maar iets daartussen.</Text>
      
      <Text style={styles.paragraph}>Kapitan ondersteunt marketeers in de uitvoering van hun merkplannen. Wij bouwen en verbouwen merken. Door professionals die bulken met ervaring. Je huisstijl is heilig en je deadline onze hartslag. Hyper-flexibel stroomlijnen we jouw marketingproces zodat je plannen snel realiteit worden.</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.subtitle}>Ons Team</Text>
        <Text style={styles.paragraph}>Bestaat uit een diverse groep professionals</Text>


          <View style={styles.workerContainer}>
            <Text style={styles.titleInformation}>El Kapitan</Text>
            <Image
               source={require('../assets/Guido.png')} style={styles.workerImage}/>
            <Text style={styles.workerInformation}>Guido Evens</Text>
            <Text style={styles.workerInformation}>Chief Merkwerker</Text>
          </View>

          <Text style={styles.subtitle}>Onze core merkwerkers</Text>
          <View style={styles.workerContainer}>
            <Image
               source={require('../assets/David.png')} style={styles.workerImage}/>
            <Text style={styles.workerInformation}>David Cruz-Martinez</Text>
            <Text style={styles.workerInformation}>Technology Wizard</Text>
          </View>

          <View style={styles.workerContainer}>
            <Image
               source={require('../assets/Ann_3D_Cartoon.png')} style={styles.workerImage}/>
            <Text style={styles.workerInformation}>Ann Winderickx</Text>
            <Text style={styles.workerInformation}>Art director</Text>
          </View>

          <View style={styles.workerContainer}>
            <Image
               source={require('../assets/Gunter.png')} style={styles.workerImage}/>
            <Text style={styles.workerInformation}>Gunter Flossie</Text>
            <Text style={styles.workerInformation}>Studio Manager</Text>
          </View>
      </View>

      <Text style={styles.subtitle}>Onze Missie</Text>
      <Text style={styles.paragraph}>Onze missie is om [specifieke missie van het bedrijf of de app]. We streven ernaar om gebruikers te helpen hun doelen te bereiken door...</Text>
      <Text style={styles.subtitle}>Neem contact met ons op</Text>
      <Text style={styles.paragraph}>Voor vragen of feedback, aarzel dan niet om contact met ons op te nemen.</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('ContactPage')}><Text style={styles.buttonText}>Contacteer ons</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  logo: {
    width: 173,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    //textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  workerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1
  },
  titleInformation: {
    fontSize: 20,
  },
  workerImage: {
    marginTop: 10,
    marginBottom: 10,
    width: 150,
    height: 200,
    borderRadius: 15
  },
  workerInformation: {
    fontSize: 16
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#E74040',
        padding: 15,
        marginTop: 5,
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