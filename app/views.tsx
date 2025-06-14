import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from './context/UserContext';
import { BASE_URL } from "../config";

interface Receta {
  id: number;
  nombre: string;
  tipo_comida: string;
  imagen_url?: string;
  instrucciones?: string[];
  calorias?: number;
  rating?: number;
}

export default function Views() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { user } = useUser();

  const [receta, setReceta] = useState<Receta | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [ingredientes, setIngredientes] = useState<{ nombre: string; cantidad: string }[]>([]);
  const [materiales, setMateriales] = useState<{ material: string }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [ingredientesDespensa, setIngredientesDespensa] = useState<string[]>([]);

  useEffect(() => {
    const fetchReceta = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/recetas?id=${id}`);
        if (!res.ok) throw new Error('Error al obtener receta');
        const data = await res.json();
        setReceta(data[0]);

        const resIng = await fetch(`${BASE_URL}/receta_ingredientes/${id}`);
        if (!resIng.ok) throw new Error('Error al obtener ingredientes');
        const dataIng = await resIng.json();
        setIngredientes(dataIng);

        const resMat = await fetch(`${BASE_URL}/receta_materiales/${id}`);
        if (!resMat.ok) throw new Error('Error al obtener materiales');
        const dataMat = await resMat.json();
        setMateriales(dataMat);

      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar toda la información de la receta');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReceta();
  }, [id]);

  const toggleFavorito = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: user.id, recetaId: receta?.id }),
      });

      if (!res.ok) throw new Error('Error al marcar favorito');
      setFavorito(true);
      Alert.alert('Listo', 'Receta añadida a favoritos');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo agregar a favoritos');
    }
  };

  // NUEVA función para verificar despensa antes de mostrar modal
  const verificarDespensa = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Debes iniciar sesión para verificar la despensa');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/despensa/${user.id}`);
      if (!res.ok) throw new Error('Error al obtener despensa');
      const data = await res.json();
      const nombresDespensa = data.map((item: any) => item.nombre.toLowerCase());
      setIngredientesDespensa(nombresDespensa);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo verificar la despensa.');
    }
  };


  const estaDisponible = (nombre: string) => {
    return ingredientesDespensa.includes(nombre.toLowerCase());
  };



  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#fd292f" />
        ) : receta ? (
          <>
            {receta.imagen_url && (
              <Image
                source={{ uri: receta.imagen_url }}
                style={styles.imagen}
                resizeMode="cover"
              />
            )}

            <Text style={styles.titulo}>{receta.nombre}</Text>

            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Tipo:</Text>
                <Text style={styles.infoValue}>{receta.tipo_comida}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Rating:</Text>
                <Text style={styles.infoValue}>{receta.rating ?? 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Calorías:</Text>
                <Text style={styles.infoValue}>{receta.calorias ?? 'N/A'}</Text>
              </View>
              <TouchableOpacity onPress={verificarDespensa} style={styles.usarBtn}>
                <Text style={styles.usarBtnText}>Usar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ingredientesContainer}>
              <Text style={styles.sectionTitle}>Ingredientes y Materiales:</Text>
              <View style={styles.row}>
                {/* Ingredientes */}
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Ingredientes</Text>
                  {ingredientes.map((item, index) => (
                    <Text key={`ing-${index}`} style={styles.ingredientePaso}>
                      • {item.cantidad} de {item.nombre}
                    </Text>
                  ))}
                </View>

                {/* Materiales */}
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Materiales</Text>
                  {materiales.map((item, index) => (
                    <Text key={`mat-${index}`} style={styles.ingredientePaso}>
                      • {item.material}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.instruccionesContainer}>
              <Text style={styles.sectionTitle}>Instrucciones:</Text>
              {Array.isArray(receta.instrucciones) && receta.instrucciones.length > 0 ? (
                receta.instrucciones.map((paso, index) => (
                  <Text key={index} style={styles.instruccionPaso}>
                    {index + 1}. {paso}
                  </Text>
                ))
              ) : (
                <Text style={styles.instruccionPaso}>No hay instrucciones disponibles.</Text>
              )}
            </View>

            <TouchableOpacity onPress={toggleFavorito} style={styles.favButton}>
              <Feather name="heart" size={28} color={favorito ? 'red' : 'gray'} />
              <Text style={styles.favText}>Agregar a favoritos</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ textAlign: 'center', fontSize: 18 }}>No se encontró la receta</Text>
        )}
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

      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Verificación de la Receta</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* Ingredientes */}
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                  Ingredientes
                </Text>
                {ingredientes.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 6, textAlign: 'center' }}>
                    {item.cantidad} de {item.nombre}{' '}
                    {estaDisponible(item.nombre) ? '✅' : '❌'}
                  </Text>
                ))}
              </View>

              {/* Materiales */}
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                  Materiales
                </Text>
                {materiales.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 6, textAlign: 'center' }}>
                    {item.material} {estaDisponible(item.material) ? '✅' : '❌'}
                  </Text>
                ))}
              </View>
            </View>

            <Text style={{ marginTop: 16, textAlign: 'center' }}>
              {(ingredientes.some(i => !estaDisponible(i.nombre)) || materiales.some(m => !estaDisponible(m.material)))
                ? 'Faltan elementos en tu despensa para esta receta.'
                : '¡Tienes todo lo necesario para preparar esta receta!'}
            </Text>

            <View style={styles.modalButtons}>


              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalBtnCancel}>
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={async () => {
                  setShowModal(false);

                  try {
                    const res = await fetch(`${BASE_URL}/usar_receta/${id}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ usuarioId: user?.id, recetaId: receta?.id }),
                    });

                    if (!res.ok) throw new Error('Fallo al registrar el uso de la receta');
                    Alert.alert('Verificación', '¡Receta marcada como usada!');
                  } catch (err) {
                    console.error(err);
                    Alert.alert('Error', 'No se pudo marcar como usada');
                  }
                }}
                style={styles.modalBtnConfirm}
              >
                <Text style={styles.modalBtnText}>Confirmar</Text>
              </TouchableOpacity>



            </View>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  imagen: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },

  ingredientesContainer: {
    marginTop: 20,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  column: {
    flex: 1,
  },

  columnTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  ingredientePaso: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'center',
  },

  instruccionesContainer: {
    marginTop: 20,
    paddingHorizontal: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  instruccionPaso: {
    fontSize: 18,
    marginBottom: 10,
    lineHeight: 24,
    textAlign: 'justify',
  },

  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'center',
  },
  favText: {
    marginLeft: 8,
    fontSize: 18,
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

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
  },

  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  infoValue: {
    fontSize: 18,
    textAlign: 'left',
  },

  usarBtn: {
    backgroundColor: '#fd292f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  usarBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  modalBtnCancel: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },

  modalBtnConfirm: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },

  modalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
