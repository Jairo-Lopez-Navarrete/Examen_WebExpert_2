import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {navigate} from '../helpers/RootNavigation';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';


export default function Footer(){
    return(
        <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={() => navigate('Home')}>
                <Ionicons name="home" style={styles.icon}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigate('AboutUs')}>
                <Fontisto name="anchor" style={styles.icon}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigate('Profile')}>
                <Ionicons name="person" style={styles.icon}/>
            </TouchableOpacity>

            {/* werkt niet */}
            {/* <TouchableOpacity style={styles.button} onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" style={styles.icon} />
            </TouchableOpacity> */}
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#2b4570',
        width: '100%',
        height: 66,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    icon: {
        color: '#fff',
        fontSize: 25,
        // marginLeft: 20,
        // marginRight: 20
    },
})