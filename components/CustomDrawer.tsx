// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { DrawerActions } from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// export default function CustomDrawer({ navigation }) {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//           <TouchableOpacity 
//             style={styles.button} 
//             onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
//           >
//             <Ionicons name="menu" style={styles.icon} />
//             <Text style={styles.text}>Sluit menu</Text>
//           </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     button: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         backgroundColor: '#987653',
//         borderRadius: 5,
//     },
//     icon: {
//         fontSize: 24,
//         color: 'white',
//         marginRight: 10,
//     },
//     text: {
//         color: 'white',
//         fontSize: 16,
//     },
// });