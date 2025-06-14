import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AddItemModal from './AddItemModal';
import { BASE_URL } from "../config";

const categories = [
  { name: 'Refrigerios' },
  { name: 'Especias' },
  { name: 'Despensa' },
  { name: 'Utensilios' },
  { name: 'Electrodomésticos' },
  { name: 'Carnes' },
  { name: 'Verduras' },
  { name: 'Frutas' },
  { name: 'Granos' },
];

export default function Pantry() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Grid de categorías */}
        <View style={styles.gridContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() =>
                router.push(`/viewPantry?categoria=${encodeURIComponent(category.name)}`)
              }
            >
              <Text style={styles.gridText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botón para abrir modal agregar */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      {/* Modal para agregar */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <AddItemModal onClose={() => setModalVisible(false)} />
      </Modal>

      {/* Barra de navegación */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/homepage')}>
          <Feather name="home" size={32} color="#444" />
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/calendar')}>
          <Feather name="calendar" size={32} color="#444" />
          <Text style={styles.navLabel}>Calendario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/favorites')}>
          <Feather name="heart" size={32} color="#444" />
          <Text style={styles.navLabel}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="box" size={32} color="#444" />
          <Text style={styles.navLabel}>Despensa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/citas')}>
          <Feather name="calendar" size={32} color="#444" />
          <Text style={styles.navLabel}>Citas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 10,
  },
  gridItem: {
    backgroundColor: '#ffe99a',
    width: (Dimensions.get('window').width - 48) / 3,
    height: 100,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gridText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#f2a365',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fef4c0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});
