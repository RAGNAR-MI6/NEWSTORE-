import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OrderConfirmationScreen = ({ navigation }) => (
  <View style={styles.center}>
    <Text style={styles.text}>Thank you for your order!</Text>
    <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default OrderConfirmationScreen; 