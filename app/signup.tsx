import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "./context/UserContext";
import { BASE_URL } from "../config";

export default function SignUp() {
  const router = useRouter();
  const { setUser } = useUser();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Por favor complete todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.usuario) {
        setUser({
          id: data.usuario.id,
          email: data.usuario.email,
        });

        Alert.alert("Éxito", "¡Usuario registrado exitosamente!", [
          {
            text: "Continuar",
            onPress: () => router.push("/homepage"),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "No se pudo registrar.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error en la conexión al servidor.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.orangeBox} />

      <Text style={styles.title}>Crear Cuenta</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Registrarme</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  orangeBox: {
    width: 100,
    height: 100,
    backgroundColor: "#fe8535",
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fef4c0",
  },
  signUpButton: {
    backgroundColor: "#fe8535",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 40,
    marginTop: 12,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});