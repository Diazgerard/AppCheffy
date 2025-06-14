import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from './context/UserContext';
import { BASE_URL } from "../config";

const ingredientTypes = [
  'Refrigerios',
  'Especias',
  'Despensa',
  'Carnes',
  'Verduras',
  'Frutas',
  'Granos',
];

const machineTypes = ['Utensilios', 'Electrodomésticos'];

interface Props {
  onClose: () => void;
}

export default function AddItemModal({ onClose }: Props) {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [tab, setTab] = useState<'ingrediente' | 'maquina'>('ingrediente');

  // Ingrediente states
  const [nombre, setNombre] = useState('');
  const [tipoIngrediente, setTipoIngrediente] = useState(ingredientTypes[0]);
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [caducidad, setCaducidad] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Maquina states
  const [tipoMaquina, setTipoMaquina] = useState(machineTypes[0]);
  const [modelo, setModelo] = useState('');

  // Función para enviar POST para ingredientes
  const agregarIngrediente = async () => {
    if (!usuarioId || !nombre || !tipoIngrediente || !unidad || !cantidad) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    const body = {
      usuario_id: usuarioId,
      nombre,
      tipo: tipoIngrediente,
      unidad,
      cantidad: parseFloat(cantidad),
      caducidad: caducidad ? caducidad.toISOString().split('T')[0] : null,
    };

    try {
      const res = await fetch(`${BASE_URL}/ingredientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al agregar ingrediente');
      Alert.alert('Éxito', 'Ingrediente agregado');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar ingrediente');
      console.error(error);
    }
  };

  // Función para enviar POST para maquinas
  const agregarMaquina = async () => {
    if (!usuarioId || !tipoMaquina || !modelo) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    const body = {
      usuario_id: usuarioId,
      tipo: tipoMaquina.toLocaleLowerCase(),
      modelo,
    };

    try {
      const res = await fetch(`${BASE_URL}/maquinas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al agregar máquina');
      Alert.alert('Éxito', 'Máquina agregada');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar máquina');
      console.error(error);
    }
  };

  // DatePicker handler
  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setCaducidad(selectedDate);
  };

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Agregar a Despensa</Text>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'ingrediente' && styles.activeTab]}
            onPress={() => setTab('ingrediente')}
          >
            <Text style={[styles.tabText, tab === 'ingrediente' && styles.activeTabText]}>
              Ingrediente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'maquina' && styles.activeTab]}
            onPress={() => setTab('maquina')}
          >
            <Text style={[styles.tabText, tab === 'maquina' && styles.activeTabText]}>
              Máquina
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulario Ingrediente */}
        {tab === 'ingrediente' && (
          <View style={styles.form}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              placeholder="Ej. Azúcar"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.optionsRow}>
              {ingredientTypes.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.optionButton,
                    tipoIngrediente === tipo && styles.optionButtonSelected,
                  ]}
                  onPress={() => setTipoIngrediente(tipo)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      tipoIngrediente === tipo && styles.optionTextSelected,
                    ]}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Unidad</Text>
            <TextInput
              placeholder="Ej. kg, litros"
              style={styles.input}
              value={unidad}
              onChangeText={setUnidad}
            />

            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              placeholder="Ej. 2"
              style={styles.input}
              keyboardType="numeric"
              value={cantidad}
              onChangeText={setCantidad}
            />

            <Text style={styles.label}>Fecha de Caducidad</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: caducidad ? '#333' : '#888' }}>
                {caducidad ? caducidad.toLocaleDateString() : 'Selecciona una fecha'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={caducidad || new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            <TouchableOpacity style={styles.submitButton} onPress={agregarIngrediente}>
              <Text style={styles.submitButtonText}>Agregar Ingrediente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Formulario Máquina */}
        {tab === 'maquina' && (
          <View style={styles.form}>
            <Text style={styles.label}>Tipo de Máquina</Text>
            <View style={styles.optionsRow}>
              {machineTypes.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.optionButton,
                    tipoMaquina === tipo && styles.optionButtonSelected,
                  ]}
                  onPress={() => setTipoMaquina(tipo)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      tipoMaquina === tipo && styles.optionTextSelected,
                    ]}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Modelo</Text>
            <TextInput
              placeholder="Ej. Modelo X"
              style={styles.input}
              value={modelo}
              onChangeText={setModelo}
            />

            <TouchableOpacity style={styles.submitButton} onPress={agregarMaquina}>
              <Text style={styles.submitButtonText}>Agregar Máquina</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={{ color: '#666' }}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width - 30,
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#f2a365',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#f2a365',
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 10,
  },
  label: {
    marginVertical: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  optionButtonSelected: {
    backgroundColor: '#f2a365',
  },
  optionText: {
    color: '#555',
  },
  optionTextSelected: {
    color: 'white',
  },
  datePickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#f2a365',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
});
