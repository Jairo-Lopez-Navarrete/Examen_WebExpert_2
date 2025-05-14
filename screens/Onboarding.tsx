import React, { useRef, useState } from 'react';
import { View, Image, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const images = [
  require('../assets/Artboard 1.png'),
  require('../assets/Artboard 1_1.png'),
  require('../assets/Artboard 1_2.png'),
  require('../assets/Artboard 1_3.png'),
  require('../assets/Artboard 1_4.png'),
  require('../assets/Artboard 1_5.png'),
  require('../assets/Artboard 1_6.png'),
  require('../assets/Artboard 1_7.png'),
  require('../assets/Artboard 1_8.png'),
  require('../assets/Artboard 1_9.png'),
  require('../assets/Artboard 1_10.png'),
  require('../assets/Artboard 1_11.png'),
  require('../assets/Artboard 1_12.png'),
  require('../assets/Artboard 1_13.png'),
  require('../assets/Artboard 1_14.png'),
  require('../assets/Artboard 1_15.png'),
  require('../assets/Artboard 1_16.png'),
  require('../assets/Artboard 1_17.png'),
  require('../assets/Artboard 1_18.png'),
  require('../assets/Artboard 1_19.png'),
  require('../assets/Artboard 1_20.png'),
];

const OnboardingScreen = () => {
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Home');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleSkip = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      {/* Overslaan bovenaan */}
      <TouchableOpacity style={styles.skipTop} onPress={handleSkip}>
        <Text style={styles.skip}>Overslaan</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item} style={styles.image} resizeMode="contain" />
          </View>
        )}
      />

      {/* Navigatieknoppen onderaan */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleBack} disabled={currentIndex === 0}>
          <Text style={[styles.backText, currentIndex === 0 && { opacity: 0.3 }]}>Terug</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentIndex === images.length - 1 ? 'Start' : 'Volgende'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
  },
  slide: {
    width,
    height: 700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 1,
    height: height * 2,
  },
  controls: {
    position: 'absolute',
    bottom: 60,
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  backText: {
    color: '#c0c0c0',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  nextText: {
    fontSize: 16,
    color: '#000',
  },
  skipTop: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 1,
  },
  skip: {
    color: '#ccc',
    fontSize: 16,
  },
});