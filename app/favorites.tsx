import React, { useEffect, useState } from 'react';
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
import { useUser } from "./context/UserContext";
import { BASE_URL } from "../config";

interface Receta {
  id: number;
  nombre: string;
}

export default function Favorites() {
  const router = useRouter();
  const { user } = useUser();
  const usuarioId = user?.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [favoritos, setFavoritos] = useState<Receta[]>([]);
  const [searchResults, setSearchResults] = useState<Receta[]>([]);

  const colores = ['#ffe8cd', '#ffe8cd'];

  const fetchFavoritos = async () => {
    if (!usuarioId) return;

    try {
      const res = await fetch(`${BASE_URL}/favoritos/${usuarioId}`);
      if (!res.ok) throw new Error('Error al obtener favoritos');
      const data = await res.json();
      setFavoritos(data);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      Alert.alert('Error', 'No se pudieron cargar los favoritos');
    }
  };

  // Función para eliminar favorito
  const eliminarFavorito = async (recetaId: number) => {
    if (!usuarioId) return;

    try {
      const res = await fetch(`${BASE_URL}/favoritos/${usuarioId}/${recetaId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar favorito');
      setFavoritos(prev => prev.filter(r => r.id !== recetaId));
      // También eliminar de resultados de búsqueda para que UI sea consistente
      setSearchResults(prev => prev.filter(r => r.id !== recetaId));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el favorito');
    }
  };

  // Búsqueda en backend con filtro por favoritos
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/buscar_recetas?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Error en búsqueda');
      const data = await res.json();

      // Filtrar solo recetas que están en favoritos
      const filteredResults = data.filter((receta: Receta) =>
        favoritos.some(fav => fav.id === receta.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    fetchFavoritos();
  }, [usuarioId]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar receta, ingrediente o utensilio"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Feather name="search" size={24} color="#444" style={styles.searchIcon} />
        </View>

        {/* Favoritos o resultados de búsqueda */}
        {(searchQuery.trim() === '' ? favoritos : searchResults).map((receta, index) => (
          <TouchableOpacity
            key={receta.id}
            style={[styles.recetaBox, { backgroundColor: colores[index % colores.length] }]}
            onPress={() => router.push({ pathname: '/views', params: { id: receta.id } })}
          >
            <Text style={styles.recetaNombre}>{receta.nombre}</Text>
            <TouchableOpacity onPress={() => eliminarFavorito(receta.id)}>
              <Feather name="trash-2" size={24} color="#1e1e1e" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
        <TouchableOpacity style={styles.navItem}>
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
});
