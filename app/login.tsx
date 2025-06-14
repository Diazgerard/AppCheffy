import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "./context/UserContext";
import { BASE_URL } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.usuario) {
        console.log("Login correcto", data);
        setUser({
          id: data.usuario.id,
          email: data.usuario.email,
        });

        router.push("/homepage");
      } else {
        console.log("Error de login:", data);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container1}>
        <View style={styles.container2}>

          {/* LOGO */}
          <Image
            source={require("../assets/images/Logo_Imagen.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>HELLO!</Text>
          <Text style={styles.subtitle}>Iniciar sesión en tu cuenta</Text>

          <View style={styles.container4}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Ingrese su contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity onPress={() => setShowForgot(true)}>
              <Text style={styles.textForgot}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* POPUP FORGOT PASSWORD */}
        {showForgot && (
          <View style={styles.forgotPopup}>
            <Text style={styles.forgotText}>Próximamente</Text>
            <TouchableOpacity onPress={() => setShowForgot(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "white",
  },
  container2: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  container4: {
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
  textForgot: {
    color: "blue",
    textAlign: "right",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#fe8535",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 40,
    marginTop: 12,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPopup: {
    position: "absolute",
    bottom: 50,
    left: 30,
    right: 30,
    backgroundColor: "#ffecc7",
    borderColor: "#d3a94c",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  forgotText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#fe8535",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
});
