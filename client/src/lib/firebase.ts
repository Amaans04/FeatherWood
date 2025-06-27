import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDk0bg4msXe42Rk49erR_xjZ_Sp9czl00s",
  authDomain: "featherwood-a914e.firebaseapp.com",
  projectId: "featherwood-a914e",
  storageBucket: "featherwood-a914e.appspot.com",
  messagingSenderId: "569292121917",
  appId: "1:569292121917:web:ed5bf4fab24bb0eb2f0754",
  measurementId: "G-8RXLHRNHLM"
};

let app;
try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    console.log('Initializing Firebase...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase already initialized, using existing instance');
    app = getApps()[0];
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Log auth state
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'No user');
});

export default app; 