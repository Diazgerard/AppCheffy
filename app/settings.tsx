import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from "../config";

export default function Settings() {
  const router = useRouter();

  // Datos de usuario simulados (los deberías cargar desde el backend o contexto)
  const [email, setEmail] = useState('usuario@correo.com');
  const [password, setPassword] = useState('********');
  const [nombre, setNombre] = useState('Nombre Apellido');
  const [premium, setPremium] = useState<boolean | null>(false);

  const handleAdquirirPremium = () => {
    Alert.alert('Premium', '¡Próximamente!');
  };

  const handleSeguimiento = () => {
    Alert.alert('Seguimiento', 'Próximamente con Premium');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Título */}
        <Text style={styles.title}>{nombre}</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          secureTextEntry
          style={styles.input}
          editable={false}
        />

        {/* Sección Premium */}
        <Text style={styles.label}>Premium</Text>
        <View style={styles.premiumContainer}>
          <Text>{premium ? 'Sí' : 'No'}</Text>
        </View>
        <TouchableOpacity onPress={handleAdquirirPremium}>
          <Text style={styles.linkText}>¿Adquirir Premium?</Text>
        </TouchableOpacity>

        {/* Botón Alergias */}
        <TouchableOpacity style={styles.allergyButton} onPress={() => router.replace('/alergias')}>
          <Text style={styles.allergyButtonText}>Alergias</Text>
        </TouchableOpacity>

        {/* Botón Seguimiento */}
        <TouchableOpacity style={styles.allergyButton} onPress={handleSeguimiento}>
          <Text style={styles.allergyButtonText}>Seguimiento</Text>
        </TouchableOpacity>
      </ScrollView>

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
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/citas')}>
          <Feather name="calendar" size={32} color="#444" />
          <Text style={styles.navLabel}>Citas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    color: '#000',
  },
  premiumContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
  linkText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
  },
  allergyButton: {
    backgroundColor: '#ffe8cd',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  allergyButtonText: {
    color: '#444',
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
});
