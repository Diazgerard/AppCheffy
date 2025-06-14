import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Button,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from './context/UserContext';
import { BASE_URL } from "../config";
import DateTimePicker from '@react-native-community/datetimepicker';

interface Item {
  id: number;
  nombre?: string;
  tipo?: string;
  modelo?: string;
  unidad?: string;
  cantidad?: number;
  caducidad?: string;
}

export default function ViewPantry() {
  const router = useRouter();
  const { user } = useUser();
  const usuarioId = user?.id;
  const params = useLocalSearchParams();
  const categoria = params.categoria;

  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const colores = ['#ffd586', '#ffd586'];
  const [showDatePicker, setShowDatePicker] = useState(false);
  

  // Estados separados para los dos modales
  const [modalVisible, setModalVisible] = useState(false);

  // Estado para el item seleccionado a mostrar y editar en modal
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Estado local para edición
  const [editData, setEditData] = useState<Partial<Item>>({});
  const [originalData, setOriginalData] = useState<Partial<Item>>({});


  function normalizeText(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  // Asegura que editData.caducidad esté en formato "YYYY-MM-DD"
  interface FormatDate {
    (date: Date): string;
  }

  const formatDate: FormatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (event: { type: string; }, selectedDate: any) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      handleChange('caducidad', formatDate(selectedDate));
    }
  };

  const itemName = (item: Item) => item.nombre ?? item.modelo ?? '';

  const fetchItems = async () => {
    if (!usuarioId || !categoria) {
      console.log('No hay usuario o categoría para buscar');
      return;
    }

    const categoriaStr = Array.isArray(categoria) ? categoria[0] : categoria;
    const normalizedTipo = normalizeText(categoriaStr);

    const isMaquina = normalizedTipo === 'utensilios' || normalizedTipo === 'electrodomesticos';

    const endpoint = isMaquina
      ? `${BASE_URL}/maquinas/${usuarioId}?tipo=${normalizedTipo}`
      : `${BASE_URL}/ingredientes/${usuarioId}?tipo=${normalizedTipo}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error al obtener datos');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error al cargar datos de pantry:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const deleteItem = async (id: number) => {
    if (!usuarioId || !categoria) return;

    const categoriaStr = Array.isArray(categoria) ? categoria[0] : categoria;
    const normalizedTipo = normalizeText(categoriaStr);
    const isMaquina = normalizedTipo === 'utensilios' || normalizedTipo === 'electrodomesticos';

    const endpoint = isMaquina
      ? `${BASE_URL}/maquinas/${usuarioId}/${id}`
      : `${BASE_URL}/ingredientes/${usuarioId}/${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el elemento');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [usuarioId, categoria]);

  const categoriaStr = Array.isArray(categoria) ? categoria[0] : categoria;
  const normalizedTipo = normalizeText(categoriaStr);
  const isCategoriaMaquina = normalizedTipo === 'utensilios' || normalizedTipo === 'electrodomesticos';

  const fetchItemDetails = async (id: number) => {
    if (!usuarioId || !categoria) return;

    const categoriaStr = Array.isArray(categoria) ? categoria[0] : categoria;
    const normalizedTipo = normalizeText(categoriaStr);
    const isMaquina = normalizedTipo === 'utensilios' || normalizedTipo === 'electrodomesticos';

    const endpoint = isMaquina
      ? `${BASE_URL}/maquinas/${usuarioId}/${id}`
      : `${BASE_URL}/ingredientes/${usuarioId}/${id}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error al obtener detalles');
      const data = await res.json();
      setSelectedItem(data);
      setEditData(data); // Inicializar el estado de edición con los datos recibidos
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los detalles');
    }
  };

  const openModal = (item: Item) => {
    fetchItemDetails(item.id);
    
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setEditData({});
  };

  // Actualizar el estado de edición con cambios en inputs
  const handleChange = (field: keyof Item, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Guardar cambios editados (Aquí deberías llamar a tu API para actualizar en backend)
  const saveChanges = async () => {
    if (!usuarioId || !selectedItem) return;

    const categoriaStr = Array.isArray(categoria) ? categoria[0] : categoria;
    const normalizedTipo = normalizeText(categoriaStr);
    const isMaquina = normalizedTipo === 'utensilios' || normalizedTipo === 'electrodomesticos';

    const endpoint = isMaquina
      ? `${BASE_URL}/maquinas/${usuarioId}/${selectedItem.id}`
      : `${BASE_URL}/ingredientes/${usuarioId}/${selectedItem.id}`;

    try {
      const res = await fetch(endpoint, {
        method: 'PUT', // o PATCH según tu API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Error al actualizar');

      // Actualiza localmente la lista
      setItems(prev => prev.map(item => item.id === selectedItem.id ? {...item, ...editData} : item));

      Alert.alert('Éxito', 'Cambios guardados');
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather name="search" size={24} color="#444" style={styles.searchIcon} />
        </View>

        {items.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
            No hay elementos en esta categoría
          </Text>
        ) : (
          items
            .filter(item => normalizeText(itemName(item)).includes(normalizeText(searchQuery)))
            .map((item, index) => (
              <View
                key={item.id}
                style={[styles.recetaBox, { backgroundColor: colores[index % colores.length] }]}
              >
                <TouchableOpacity onPress={() => openModal(item)}>
                  <Text style={styles.recetaNombre}>{itemName(item)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Confirmar eliminación',
                      `¿Deseas eliminar "${itemName(item)}"?`,
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Eliminar', style: 'destructive', onPress: () => deleteItem(item.id) }
                      ]
                    );
                  }}
                >
                  <Feather name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))
      )}
      </ScrollView>

      {/* Modal único para edición tanto máquinas como ingredientes */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainerCustom}>
            <Text style={styles.titleCustom}>
              {isCategoriaMaquina ? 'Detalle de Máquina' : 'Detalle de Ingrediente'}
            </Text>
            {selectedItem ? (
              <ScrollView style={{ width: '100%' }}>
                {isCategoriaMaquina ? (
                  <>
                    <Text style={styles.labelCustom}>Tipo:</Text>
                    <View style={styles.chipContainer}>
                      {['Utensilios', 'Electrodomésticos'].map(tipo => {
                        const currentTipo = (editData.tipo ?? '').trim().toLowerCase();
                        const tipoLower = tipo.toLowerCase();
                        const isSelected = currentTipo === tipoLower;
                        return (
                          <TouchableOpacity
                            key={tipo}
                            style={[styles.chip, isSelected && styles.selectedChip]}
                            onPress={() => handleChange('tipo', tipo)}
                          >
                            <Text style={isSelected ? styles.selectedChipText : styles.chipText}>
                              {tipo}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <Text style={styles.labelCustom}>Modelo:</Text>
                    <TextInput
                      style={styles.inputCustom}
                      value={editData.modelo ?? ''}
                      onChangeText={text => handleChange('modelo', text)}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.labelCustom}>Nombre:</Text>
                    <TextInput
                      style={styles.inputCustom}
                      value={editData.nombre ?? ''}
                      onChangeText={text => handleChange('nombre', text)}
                    />

                    <Text style={styles.labelCustom}>Tipo:</Text>
                    <View style={styles.chipContainer}>
                      {['Refrigerios', 'Especias', 'Despensa', 'Carnes', 'Verduras', 'Frutas', 'Granos'].map(tipo => {
                        const isSelected = editData.tipo?.trim().toLowerCase() === tipo.toLowerCase(); // Comparación segura
                        return (
                          <TouchableOpacity
                            key={tipo}
                            style={[
                              styles.chip,
                              isSelected && styles.selectedChip,
                            ]}
                            onPress={() => handleChange('tipo', tipo)}
                          >
                            <Text style={isSelected ? styles.selectedChipText : styles.chipText}>
                              {tipo}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>


                    <Text style={styles.labelCustom}>Unidad:</Text>
                    <TextInput
                      style={styles.inputCustom}
                      value={editData.unidad ?? ''}
                      onChangeText={text => handleChange('unidad', text)}
                    />

                    <Text style={styles.labelCustom}>Cantidad:</Text>
                    <TextInput
                      style={styles.inputCustom}
                      keyboardType="numeric"
                      value={editData.cantidad !== undefined ? String(editData.cantidad) : ''}
                      onChangeText={text => handleChange('cantidad', text)}
                    />

                    <Text style={styles.labelCustom}>Fecha de Caducidad:</Text>
                    <TouchableOpacity
                      style={[styles.inputCustom, { justifyContent: 'center' }]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text>{editData.caducidad ? editData.caducidad : 'Selecciona una fecha'}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={editData.caducidad ? new Date(editData.caducidad) : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                      />
                    )}

                  </>
                )}

                <View style={styles.buttonRowCustom}>
                  <TouchableOpacity>
                    <Text style={styles.cancelButtonTextCustom}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.saveButtonCustom} onPress={saveChanges}>
                    <Text style={styles.saveButtonTextCustom}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <Text>No hay detalles disponibles</Text>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButtonCustom}>
              <Text style={{ color: '#666', textAlign: 'center' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  recetaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 12,
  },
  recetaNombre: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerCustom: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  titleCustom: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  labelCustom: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  inputCustom: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  buttonRowCustom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  cancelButtonCustom: {
    flex: 1,
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonTextCustom: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonCustom: {
    flex: 1,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonTextCustom: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButtonCustom: {
    marginTop: 10,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },

  chipContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginVertical: 8,
  gap: 8,
},
chip: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 16,
  backgroundColor: '#f1f1f1',
},
selectedChip: {
  backgroundColor: '#e0a96d',
},
chipText: {
  color: '#444',
},
selectedChipText: {
  color: 'white',
  fontWeight: 'bold',
},

});