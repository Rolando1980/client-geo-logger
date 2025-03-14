
// Importa las funciones que necesitas de los SDK que necesitas
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Configuración de Firebase de tu aplicación web
// Para Firebase JS SDK v7.20.0 y versiones posteriores, MeasurementId es opcional
const firebaseConfig = {
  apiKey: "AIzaSyCG_7iq4DjEN6rtmloaIXIzCmz0P6vD_QI",
  authDomain: "ememsa-app-18473.firebaseapp.com",
  databaseURL: "https://ememsa-app-18473-default-rtdb.firebaseio.com",
  projectId: "ememsa-app-18473",
  storageBucket: "ememsa-app-18473.firebasestorage.app",
  messagingSenderId: "488559560907",
  appId: "1:488559560907:web:e6c7d22cfa4822d164734e",
  measurementId: "G-EQDDGRKPS6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
