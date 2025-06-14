import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from "../config";

interface Profesional {
  id: number;
  nombre: string;
  edad: number;
  profesion: string;
}

export default function Citas() {
  const router = useRouter();
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Para mostrar el popmenu
  const [modalVisible, setModalVisible] = useState(false);
  const [profSeleccionado, setProfSeleccionado] = useState<Profesional | null>(null);

  // Función para buscar profesionales con query
  const fetchProfesionales = async (query = '') => {
    setLoading(true);
    try {
      const url = query
        ? `${BASE_URL}/profesionales?q=${encodeURIComponent(query)}`
        : `${BASE_URL}/profesionales`;
      const res = await fetch(url);
      const data = await res.json();
      setProfesionales(data);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cada vez que cambie searchQuery, hacemos fetch
  useEffect(() => {
    // Pequeño debounce para no hacer fetch en cada letra
    const timeoutId = setTimeout(() => {
      fetchProfesionales(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Cuando tocan un profesional, mostramos el modal
  const handlePressProfesional = (prof: Profesional) => {
    setProfSeleccionado(prof);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o profesión"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather name="search" size={24} color="#444" style={styles.searchIcon} />
        </View>

        {/* Lista de profesionales */}
        {loading ? (
          <ActivityIndicator size="large" color="#ffd586" style={{ marginTop: 30 }} />
        ) : profesionales.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
            No se encontraron profesionales
          </Text>
        ) : (
          profesionales.map((profesional) => (
            <TouchableOpacity
              key={profesional.id}
              style={styles.proCard}
              onPress={() => handlePressProfesional(profesional)}
            >
              <Text style={styles.nombre}>
                {profesional.nombre} ({profesional.edad} años)
              </Text>
              <Text style={styles.detalle}>{profesional.profesion}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal para popmenu */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Próximamente</Text>
          </View>
        </Pressable>
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
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/pantry')}>
          <Feather name="box" size={32} color="#444" />
          <Text style={styles.navLabel}>Despensa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="calendar" size={32} color="#444" />
          <Text style={styles.navLabel}>Citas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingLeft: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  proCard: {
    backgroundColor: '#ffd586',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
  },
  nombre: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
  detalle: {
    fontSize: 14,
    color: '#333333',
    opacity: 0.9,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffd586',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
