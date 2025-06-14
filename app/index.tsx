import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, StatusBar, Text, StyleSheet, TouchableOpacity, View,  ScrollView, Image} from "react-native";
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#25292e" />

      <Image 
        source={require('../assets/images/Logo_Imagen.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.text}>Cheffy</Text>

      <View style={styles.orangeBox}>
        <ScrollView 
          contentContainerStyle={styles.orangeScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.orangeText}>
            ¡Tu cocina, simplificada!{"\n\n"}
            ¿Cansado de pensar todos los días qué vas a cocinar? Cheffy es tu nuevo aliado en la cocina: una app inteligente que no solo te inspira con recetas deliciosas, sino que te ayuda a planificar tus comidas, usar lo que ya tenés en casa y ahorrar tiempo y esfuerzo.{"\n\n"}
            🔎 Explorá cientos de recetas con imágenes irresistibles, instrucciones claras y todo lo que necesitás para cocinar como un chef.{"\n\n"}
            ❤️ Guardá tus favoritas o programá tus platos para la semana con solo unos toques.{"\n\n"}
            📦 ¿Qué tenés en la despensa? ¡Cheffy te sugiere recetas basadas en los ingredientes y utensilios que ya tenés!{"\n\n"}
            🧠 Más que una app de recetas: Cheffy piensa por vos, organiza tu semana y convierte tu cocina en un espacio más práctico, creativo y delicioso.
          </Text>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>Registrarme</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#fef4c0",
    padding: 12,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  linkText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  orangeBox: {
    backgroundColor: "#FFA500",
    width: "80%",
    maxHeight: 300,
    borderRadius: 20,
    marginBottom: 30,
    padding: 15,
  },
  orangeScroll: {
    paddingBottom: 10,
  },
  orangeText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },
});
