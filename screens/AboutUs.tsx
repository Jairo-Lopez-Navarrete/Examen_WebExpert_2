import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Linking, StyleSheet, ScrollView, Image, RefreshControl, Pressable, FlatList, Dimensions, Animated,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AboutUs() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [showMap, setShowMap] = useState(false);

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

  const workers = [
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
  ];

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onScroll={(event) => {
        const y = event.nativeEvent.contentOffset.y;
        if (y > 600 && !showMap) {
          setShowMap(true);
        }
      }}
      scrollEventThrottle={16}
    >
      <View style={styles.container}>
        <Animated.Text style={[styles.title, { transform: [{ translateX: slideAnimation }] }]}>
          We love to have you around.
        </Animated.Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Wij zijn Kapitan. {'\n'}{'\n'}Geen reclamebureau en ook geen freelancers maar iets
            daartussenin. We noemen onszelf merkwerkers.{'\n'}{'\n'}
            Kapitan heeft een kantoor gelegen aan de Kempische Kaai in Hasselt, aan de oevers van de
            Blauwe Boulevard waar een leuke en gezellige sfeer hangt.{'\n'}{'\n'}
            We delen graag onze werkplek met jou. Als je een rustige werkplek zoekt of een inspirerende
            plek om te meeten, twijfel niet om te reserveren.
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.kapitan.be')}>
            www.kapitan.be
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
          <Text style={styles.subtitle2}>De core merkwerkers</Text>
          <FlatList
            data={workers}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            keyExtractor={(item) => item.name}
            initialNumToRender={1}
            windowSize={2}
            renderItem={({ item }) => (
              <View style={styles.workerCard}>
                <Image source={item.image} style={styles.workerImage} />
                <Text style={styles.titleInformation}>{item.name}</Text>
                <Text style={styles.workerInformation}>{item.role}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.mapContainer}>
          <Text style={styles.subtitle2}>Hier vind je ons</Text>
          {showMap ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 50.933898,
                longitude: 5.337144,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{ latitude: 50.9333933898, longitude: 5.337144 }}
                title="Kapitan"
                description="Kempische Kaai, Hasselt"
              />
            </MapView>
          ) : (
            <View style={[styles.map, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text>Kaart laden...</Text>
            </View>
          )}
          <Ionicons name="log-out-outline" color="#628395" />
          <Text style={styles.paragraph}>Tip: Zoek de walvis 🐋</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle2}>Neem contact met ons op</Text>
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
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#113A66',
    marginVertical: 10,
    fontFamily: 'Poppins_400Regular',
  },
  section: {
    marginVertical: 25,
  },
  highlightSection: {
    padding: 15,
  },
  title: {
    fontSize: 25,
    marginVertical: 20,
    color: '#232323',
    fontFamily: 'Poppins_500Medium',
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 15,
    color: '#232323',
    fontFamily: 'Poppins_500Medium',
  },
  subtitle2: {
    fontSize: 20,
    marginBottom: 15,
    color: '#232323',
    fontFamily: 'Poppins_500Medium',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#232323',
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
    padding: 10,
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
    color: '#232323',
  },
  workerInformation: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#232323',
    textAlign: 'center',
  },
  carouselContainer: {
    paddingVertical: 10,
    paddingLeft: 5,
  },
  mapContainer: {
    marginBottom: 30,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width,
    height: 200,
    flex: 1,
  },
  button: {
    backgroundColor: '#E74040',
    padding: 15,
    marginTop: 20,
    borderRadius: 20,
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