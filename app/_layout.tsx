import { Stack } from "expo-router";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from "expo-router";
import { UserProvider } from "./context/UserContext";

const StackNavigator = createNativeStackNavigator();

export default function RootLayout() {
  const router = useRouter();
  return (
    <UserProvider>
      <Stack screenOptions={{ headerTitleAlign: 'center', animation: 'fade' }}>   
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTintColor: "#fff",
          }}
        />

        <Stack.Screen name="login" options={{ headerTitle: "Iniciar Sesión" }} />
        <Stack.Screen name="signup" options={{ headerTitle: "Registrarse" }} />

        {/* HOMEPAGE con ícono y fondo rojo */}
        <Stack.Screen
          name="homepage"
          options={{
            headerTitle: "Inicio",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen 
          name="calendar" 
          options={{
            headerTitle: "Calendario",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen 
          name="favorites" 
          options={{
            headerTitle: "Favoritos",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="pantry" 
          options={{
            headerTitle: "Despensa",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="citas" 
          options={{
            headerTitle: "Profesionales",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{
            headerTitle: "Perfil",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="alergias" 
          options={{
            headerTitle: "Alergias",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="viewPantry" 
          options={{
            headerTitle: "Despensa",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="viewReceta" 
          options={{
            headerTitle: "Receta",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="viewProfesional" 
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="views" 
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#ff9898", // ← color del fondo del header
            },
            headerTintColor: "#fff", // ← color del texto del header
            headerRight: () => (
              <TouchableOpacity onPress={()=> router.push("/settings")}>
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color="#fff" // ← color del ícono para que combine
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          }} 
        />
      </Stack>
    </UserProvider>
    
  );
}
