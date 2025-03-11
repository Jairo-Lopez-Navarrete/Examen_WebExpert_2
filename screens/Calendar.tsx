import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

export default function Kajuit(){
    return(
       <View style={styles.container}>
            <Text>Test</Text>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});