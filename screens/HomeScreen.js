import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(json => {
        setProducts(json);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ marginRight: 15 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cart</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Button title="Add to Cart" onPress={() => dispatch(addToCart(item))} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  price: {
    fontSize: 15,
    color: '#222',
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 