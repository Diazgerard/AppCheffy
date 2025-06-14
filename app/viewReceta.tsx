import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BASE_URL } from "../config";

interface Receta {
  id: number;
  nombre: string;
  tipo_comida: string;
  imagen_url?: string;
  instrucciones?: string;
}

export default function ViewReceta() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoria = Array.isArray(params.categoria) ? params.categoria[0] : params.categoria;

  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaActual, setCategoriaActual] = useState<string | null>(null);

  useEffect(() => {
    if (!categoria) return;

    setCategoriaActual(categoria);
    fetchRecetasPorCategoria(categoria);
  }, [categoria]);

  // Fetch recetas por categoría (al cargar y si no hay búsqueda)
  const fetchRecetasPorCategoria = async (cat: string) => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/recetas?tipo_comida=${encodeURIComponent(cat)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al obtener recetas');
      const data = await res.json();
      setRecetas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las recetas');
    } finally {
      setLoading(false);
    }
  };

  // Buscar recetas por texto usando endpoint backend que busca por nombre o ingrediente
  const buscarRecetas = async (texto: string) => {
    if (texto.trim() === '') {
      // Si la búsqueda está vacía, mostrar solo por categoría
      if (categoriaActual) fetchRecetasPorCategoria(categoriaActual);
      return;
    }

    setLoading(true);
    try {
      const url = `${BASE_URL}/buscar_recetas?q=${encodeURIComponent(texto)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al buscar recetas');
      const data = await res.json();
      
      setRecetas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron buscar las recetas');
    } finally {
      setLoading(false);
    }
  };

  const onSearchChange = (text: string) => {
    setSearchQuery(text);
    buscarRecetas(text);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.titulo}>Recetas: {categoria}</Text>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o ingrediente"
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#fd292f" style={{ marginTop: 30 }} />
        ) : recetas.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
            No hay recetas que coincidan
          </Text>
        ) : (
          recetas.map((receta, index) => (
            <TouchableOpacity
              key={receta.id}
              style={[
                styles.recetaBox,
                { backgroundColor: index % 2 === 0 ? '#ffe99a' : '#ffd586' },
              ]}
              onPress={() => router.push({ pathname: '/views', params: { id: receta.id } })}
            >
              <Text style={styles.recetaNombre}>{receta.nombre}</Text>
              <Feather name="info" size={24} color="white" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  recetaBox: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recetaNombre: {
    fontSize: 18,
    color: '#1e1e1e',
    fontWeight: '600',
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
