import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, Modal, Pressable
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from './context/UserContext';
import { BASE_URL } from "../config";

interface Alergia {
  id: number;
  nombre: string;
}

export default function Alergias() {
  const router = useRouter();
  const { user } = useUser();
  const usuarioId = user?.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaAlergia, setNuevaAlergia] = useState('');

  const fetchAlergias = async () => {
    if (!usuarioId) return;

    try {
      const res = await fetch(`${BASE_URL}/alergias/${usuarioId}`);
      const data = await res.json();
      setAlergias(data);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar las alergias');
    }
  };

  useEffect(() => {
    fetchAlergias();
  }, [usuarioId]);

  const agregarAlergia = async () => {
    if (!nuevaAlergia.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/alergias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, nombre: nuevaAlergia.trim() }),
      });
      if (res.ok) {
        setNuevaAlergia('');
        setModalVisible(false);
        fetchAlergias();
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo agregar la alergia');
    }
  };

  const eliminarAlergia = async (id: number) => {
    try {
      await fetch(`${BASE_URL}/alergias/${usuarioId}/${id}`, {
        method: 'DELETE',
      });
      fetchAlergias();
    } catch (err) {
      Alert.alert('Error', 'No se pudo eliminar la alergia');
    }
  };

  const colores = ['#ffd586', '#ffe299'];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar Alergia"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather name="search" size={24} color="#444" style={styles.searchIcon} />
        </View>

        {alergias.filter(a => a.nombre.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay alergias registradas</Text>
        ) : (
          alergias
            .filter(a => a.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((a, index) => (
              <TouchableOpacity
                key={a.id}
                onLongPress={() => Alert.alert(
                  'Eliminar',
                  `¿Eliminar la alergia "${a.nombre}"?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Eliminar', onPress: () => eliminarAlergia(a.id), style: 'destructive' },
                  ]
                )}
                style={[styles.recetaBox, { backgroundColor: colores[index % colores.length] }]}
              >
                <Text style={styles.recetaNombre}>{a.nombre}</Text>
              </TouchableOpacity>
            ))
        )}

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Agregar Alergia</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para agregar alergia */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Nueva Alergia</Text>
            <TextInput
              value={nuevaAlergia}
              onChangeText={setNuevaAlergia}
              placeholder="Nombre de la alergia"
              style={styles.inputModal}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalBtn} onPress={agregarAlergia}>
                <Text>Agregar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* NavBar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/homepage')}>
          <Feather name="home" size={28} />
          <Text>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/calendar')}>
          <Feather name="calendar" size={28} />
          <Text>Calendario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/favorites')}>
          <Feather name="heart" size={28} />
          <Text>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/pantry')}>
          <Feather name="box" size={28} />
          <Text>Despensa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/citas')}>
          <Feather name="calendar" size={28} />
          <Text>Citas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    margin: 10,
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  searchIcon: {
    marginLeft: 10,
  },
  recetaBox: {
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
  },
  recetaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ffec99',
    margin: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fef4c0', // Color amarillo claro
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: 300,
    borderRadius: 12,
  },
  inputModal: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 4,
  },
});
