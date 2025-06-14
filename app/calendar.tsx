import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from './context/UserContext';
import { BASE_URL } from "../config";

export default function Calendar() {
  const router = useRouter();
  const { user } = useUser();
  const usuarioId = user?.id;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [datosFecha, setDatosFecha] = useState<{
    desayuno_nombre?: string | null;
    almuerzo_nombre?: string | null;
    cena_nombre?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Estado para controlar el modal premium
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (!selectedDate || !usuarioId) {
      setDatosFecha(null);
      return;
    }

    const fetchDatos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/calendario/${usuarioId}/${selectedDate}`);
        if (!res.ok) throw new Error('Error al cargar datos');
        const json = await res.json();

        if (json.existe) {
          setDatosFecha(json.data);
        } else {
          setDatosFecha(null);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las recetas');
        setDatosFecha(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [selectedDate, usuarioId]);

  const handleDayPress = (day: DateData) => {
    if (!modalVisible) {
      setSelectedDate(day.dateString);
    }
  };

  const handleDelete = (tipo: string) => {
    if (modalVisible) return;
    console.log(`Eliminar receta de ${tipo} en ${selectedDate}`);
  };

  const handleEdit = (tipo: string) => {
    if (modalVisible) return;
    console.log(`Editar receta de ${tipo} en ${selectedDate}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <RNCalendar
          onDayPress={handleDayPress}
          theme={{
            selectedDayBackgroundColor: '#00adf5',
            todayTextColor: '#00adf5',
            arrowColor: '#00adf5',
          }}
          enableSwipeMonths={true}
          
        />

        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>Fecha seleccionada: {selectedDate}</Text>
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="#00adf5" />}

        {selectedDate && !loading && (
          <View style={styles.sectionsContainer}>
            {['desayuno', 'almuerzo', 'cena'].map((tipo) => {
              const nombreReceta = (datosFecha as any)?.[`${tipo}_nombre`];
              return (
                <View key={tipo}>
                  <Text style={styles.sectionTitle}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Text>
                  <View style={styles.section}>
                    {nombreReceta ? (
                      <>
                        <View style={[styles.box, { backgroundColor: '#ffe8cd' }]}>
                          <Text style={styles.boxText}>{nombreReceta}</Text>
                        </View>
                        <View style={styles.iconsContainer}>
                          <TouchableOpacity onPress={() => handleDelete(tipo)} disabled={modalVisible}>
                            <Feather name="trash" size={20} color={modalVisible ? '#ccc' : '#444'} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleEdit(tipo)} disabled={modalVisible}>
                            <Feather name="edit-2" size={20} color={modalVisible ? '#ccc' : '#444'} />
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={[styles.box, { backgroundColor: '#fdb10b' }]}
                        disabled={modalVisible}
                      >
                        <Feather name="plus" size={20} color="#fff" />
                        <Text style={[styles.boxText, { marginLeft: 8 }]}>Agregar receta</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          router.replace('/homepage');
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Próximamente con premium</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.replace('/homepage');
              }}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/homepage')}>
          <Feather name="home" size={32} color="#444" />
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/citas')}>
          <Feather name="calendar" size={32} color="#444" />
          <Text style={styles.navLabel}>Citas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedDateContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  sectionsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#444',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  box: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  iconsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    width: 60,
    justifyContent: 'space-between',
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  modalText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#00adf5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
