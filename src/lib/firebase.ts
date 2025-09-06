// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration.
// **IMPORTANT**: This is a placeholder configuration. Replace it with your actual
// Firebase project configuration to connect the app to your Firebase backend.
// You can get this from the Firebase console:
// (Project Settings > General > Your apps > Firebase SDK snippet > Config)
const firebaseConfig = {
  apiKey: "AIzaSyAunf47hCXKytT856H-_Z-0ZAe65QIFto4",
  authDomain: "made-in-site.firebaseapp.com",
  projectId: "made-in-site",
  storageBucket: "made-in-site.firebasestorage.app",
  messagingSenderId: "198664791827",
  appId: "1:198664791827:web:369cbd547a3a3dbd40dce6",
  measurementId: "G-PF2J62N5P1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
