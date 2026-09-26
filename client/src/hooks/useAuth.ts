import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: Date;
  isAdmin: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  orders: string[]; // Array of order IDs
}

interface User extends FirebaseUser {
  isAdmin?: boolean;
}

interface Order {
  id: string;
  userId: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setUser({ ...firebaseUser, isAdmin: userData.isAdmin || false });
          } else {
            setUser(firebaseUser);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, userData: Omit<UserData, "createdAt" | "isAdmin">) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        createdAt: new Date(),
        isAdmin: false, // Default to false for new users
      });

      setUser({ ...user, isAdmin: false });
      return user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user data including isAdmin status
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        setUser({ ...user, isAdmin: userData.isAdmin || false });
      } else {
        setUser(user);
      }
      
      return user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create new user document with more complete data
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "",
          email: user.email,
          phone: "",
          city: "",
          createdAt: new Date(),
          isAdmin: false,
          photoURL: user.photoURL || "",
          orders: [],
          lastLogin: new Date()
        });
        setUser({ ...user, isAdmin: false });
      } else {
        // Update last login time for existing users
        await updateDoc(doc(db, "users", user.uid), {
          lastLogin: new Date()
        });
        const userData = userDoc.data() as UserData;
        setUser({ ...user, isAdmin: userData.isAdmin || false });
      }

      return user;
    } catch (error: any) {
      console.error('Google authentication error:', error);
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by the browser. Please allow popups for this site.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'An error occurred during Google sign in');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const updateUserAddress = async (address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { address }, { merge: true });
    } catch (error) {
      console.error("Error updating user address:", error);
      throw error;
    }
  };

  const createOrder = async (orderData: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }>;
    totalAmount: number;
    status: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  }) => {
    if (!user) return null;
    try {
      const orderRef = doc(collection(db, "orders"));
      const order = {
        ...orderData,
        userId: user.uid,
        createdAt: new Date(),
      };
      await setDoc(orderRef, order);
      return orderRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const getUserData = async () => {
    if (!user) return null;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const getUserOrders = async () => {
    if (!user) return [];
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(ordersQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
  };

  const getAllOrders = async () => {
    if (!user?.isAdmin) return [];
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!user?.isAdmin) throw new Error("Unauthorized");
    try {
      await setDoc(doc(db, "orders", orderId), { status }, { merge: true });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    getUserData,
    updateUserAddress,
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    resetPassword
  };
} 