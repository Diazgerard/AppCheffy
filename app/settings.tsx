import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../config';
import { useUser } from './context/UserContext';

interface Usuario {
  email: string;
  password: string;
  nombre: string;
  premium: boolean;
  // otros campos si existen...
}

export default function Settings() {
  const router = useRouter();
  const { user } = useUser(); // supondremos que devuelve info básica o id para filtrar

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      setError(null);

      try {
        // Aquí idealmente filtrarías por user.id o user.email
        const res = await fetch(`${BASE_URL}/usuarios`);
        if (!res.ok) throw new Error('Error al cargar usuario');

        const data: Usuario[] = await res.json();

        // Por simplicidad, tomamos el primer usuario (en producción filtra por el usuario autenticado)
        if (data.length > 0) {
          setUsuario(data[0]);
        } else {
          setError('No se encontró usuario');
        }
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [user]);

  const handleAdquirirPremium = () => {
    Alert.alert('Premium', '¡Próximamente!');
  };

  const handleSeguimiento = () => {
    Alert.alert('Seguimiento', 'Próximamente con Premium');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <TouchableOpacity onPress={() => setError(null)}>
          <Text style={{ color: '#007BFF' }}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.centered}>
        <Text>No hay información de usuario disponible.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <Text style={styles.title}>{usuario.nombre}</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={usuario.email} editable={false} />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={'********'}
          secureTextEntry
          style={styles.input}
          editable={false}
        />

        <Text style={styles.label}>Premium</Text>
        <View style={styles.premiumContainer}>
          <Text>{usuario.premium ? 'Sí' : 'No'}</Text>
        </View>
        <TouchableOpacity onPress={handleAdquirirPremium}>
          <Text style={styles.linkText}>¿Adquirir Premium?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.allergyButton}
          onPress={() => router.replace('/alergias')}
        >
          <Text style={styles.allergyButtonText}>Alergias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.allergyButton} onPress={handleSeguimiento}>
          <Text style={styles.allergyButtonText}>Seguimiento</Text>
        </TouchableOpacity>
      </ScrollView>

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
