import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQuantity, decreaseQuantity } from '../redux/cartSlice';

const Toast = ({ visible, message, onHide }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 1800);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  if (!visible) return null;
  return (
    <View style={styles.toast}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const ProductDetailModal = ({ visible, product, quantity, onAdd, onIncrease, onDecrease, onClose }) => {
  if (!product) return null;
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={{ uri: product.image }} style={styles.modalImage} resizeMode="contain" />
          <Text style={styles.modalTitle}>{product.title}</Text>
          <Text style={styles.modalDescription}>{product.description}</Text>
          <Text style={styles.modalPrice}>${product.price}</Text>
          {quantity === 0 ? (
            <TouchableOpacity style={styles.addButton} onPress={onAdd} activeOpacity={0.7}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease} activeOpacity={0.7}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
              <Text style={styles.qty}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease} activeOpacity={0.7}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}><Text style={styles.closeBtnText}>Close</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const StarRating = ({ rate }) => {
  const fullStars = Math.floor(rate);
  const halfStar = rate - fullStars >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) stars.push('★');
  if (halfStar) stars.push('☆');
  while (stars.length < 5) stars.push('☆');
  return (
    <Text style={styles.stars}>{stars.join(' ')}</Text>
  );
};

const CategoryFilter = ({ categories, selected, onSelect }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
    <TouchableOpacity
      style={[styles.filterBtn, !selected ? styles.filterBtnActive : null]}
      onPress={() => onSelect(null)}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterBtnText, !selected ? styles.filterBtnTextActive : null]}>All</Text>
    </TouchableOpacity>
    {categories.map(cat => (
      <TouchableOpacity
        key={cat}
        style={[styles.filterBtn, selected === cat ? styles.filterBtnActive : null]}
        onPress={() => onSelect(cat)}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterBtnText, selected === cat ? styles.filterBtnTextActive : null]}>{cat}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(json => {
        setProducts(json);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(json => setCategories(json));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ padding: 5 }} activeOpacity={0.7}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cart</Text>
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
              </View>
            )}
        </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, cartItems]);

  const getProductQuantity = (productId) => {
    const item = cartItems.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <View style={{ flex: 1 }}>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
    <FlatList
        data={filteredProducts}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => { setSelectedProduct(item); setModalVisible(true); }}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{item.title}</Text>
            <StarRating rate={item.rating?.rate || 0} />
          <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>${item.price}</Text>
          </TouchableOpacity>
        )}
      />
      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        quantity={selectedProduct ? getProductQuantity(selectedProduct.id) : 0}
        onAdd={() => {
          dispatch(addToCart(selectedProduct));
          setToastVisible(true);
        }}
        onIncrease={() => { dispatch(increaseQuantity(selectedProduct.id)); }}
        onDecrease={() => { dispatch(decreaseQuantity(selectedProduct.id)); }}
        onClose={() => setModalVisible(false)}
      />
      <Toast
        visible={toastVisible}
        message="Added to cart!"
        onHide={() => setToastVisible(false)}
      />
    </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 16,
    color: '#222',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  qtyBtn: {
    backgroundColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  qty: {
    marginHorizontal: 15,
    fontSize: 18,
  },
  closeBtn: {
    marginTop: 5,
    padding: 8,
  },
  closeBtnText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  toast: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  toastText: {
    backgroundColor: '#222',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
    overflow: 'hidden',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  cartBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stars: {
    color: '#f5a623',
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  filterBtnActive: {
    backgroundColor: '#007bff',
  },
  filterBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom:2
  },
  filterBtnTextActive: {
    color: '#fff',
  },
});

export default HomeScreen; 