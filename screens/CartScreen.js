import React from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart, clearCart } from '../redux/cartSlice';

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);

  const handleBuy = () => {
    dispatch(clearCart());
    navigation.navigate('OrderConfirmation');
  };
  

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.product.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.product.image }} style={styles.image} resizeMode="contain" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.title}>{item.product.title}</Text>
              <Text style={styles.price}>${item.product.price}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => dispatch(decreaseQuantity(item.product.id))} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => dispatch(increaseQuantity(item.product.id))} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dispatch(removeFromCart(item.product.id))} style={styles.removeBtn}>
                  <Text style={{ color: 'red', marginLeft: 10 }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total}</Text>
        <Button title="Buy" onPress={handleBuy} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#222',
    marginBottom: 5,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qty: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeBtn: {
    marginLeft: 10,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  total: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default CartScreen; 