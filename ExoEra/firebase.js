// Import Firebase SDK using modular syntax
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8Yb4oQFzuVh5xRQdp8oW7U7xRn6DwwJI",
    authDomain: "developer-1b4f5.firebaseapp.com",
    databaseURL: "https://developer-1b4f5-default-rtdb.firebaseio.com",
    projectId: "developer-1b4f5",
    storageBucket: "developer-1b4f5.firebasestorage.app",
    messagingSenderId: "325509631041",
    appId: "1:325509631041:web:1796242679479a85a94ac0",
    measurementId: "G-83H9N56LPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Ensure account selection popup
googleProvider.setCustomParameters({ prompt: "select_account" });
facebookProvider.setCustomParameters({ display: "popup" });

// Export Firebase services
export { auth, db, storage, googleProvider, facebookProvider };



