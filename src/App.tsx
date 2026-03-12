import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { AgeGate } from './components/AgeGate';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Favorites from './pages/Favorites';
import DispensaryDetail from './pages/DispensaryDetail';
import Social from './pages/Social';
import Guide from './pages/Guide';
import Cart from './pages/Cart';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Initialize user profile in Firestore if it doesn't exist
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            favoriteProductIds: [],
            favoriteDispensaryIds: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        {!isAgeVerified && <AgeGate onConfirm={() => setIsAgeVerified(true)} />}
        {isAgeVerified && (
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/dispensary/:id" element={<DispensaryDetail />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/social" element={<Social />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        )}
      </Router>
    </ErrorBoundary>
  );
}
