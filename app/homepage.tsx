import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const categorias = [
  'Desayuno', 'Almuerzo', 'Cena', 'Vegano', 'Vegetariano', 'Dieta', 'Postres', 'Bebida', 'Snack'
];

const recetas = [
  require('../assets/images/receta1.jpeg'),
  require('../assets/images/receta2.jpg'),
  require('../assets/images/receta3.jpeg'),
  require('../assets/images/receta4.jpeg'),
];

const { width } = Dimensions.get('window');

export default function Homepage() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.titulo}>Cheffy</Text>

        <Text style={styles.subtitulo}>Las Mejores Recetas de la Semana</Text>

        <Carousel
          loop
          width={width * 0.9}
          height={200}
          autoPlay={false}
          data={recetas}
          scrollAnimationDuration={600}
          style={styles.recetasScroll}
          renderItem={({ item }) => (
            <Image source={item} style={styles.recetaImagen} />
          )}
        />

        {/* Botones de categorías en filas de 3 */}
        <View style={styles.categoriasGrid}>
          {categorias.map((cat, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.botonCategoria}
              onPress={() => router.push(`/viewReceta?categoria=${cat}`)}>
                
              <Text style={styles.textoBoton}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  scrollViewContent: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 80, // Agregar espacio para que el contenido no quede oculto debajo del navbar
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  categoriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  botonCategoria: {
    backgroundColor: '#ffe99a', // Color rojo como pediste
    width: '28%',
    aspectRatio: 1, // cuadrado perfecto
    borderRadius: 12, // muy sutil para que no se vea feo
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // para Android
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: '600',
    color: 'ffe99a', // Color blanco para el texto
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  recetasScroll: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  recetaImagen: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
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
});
