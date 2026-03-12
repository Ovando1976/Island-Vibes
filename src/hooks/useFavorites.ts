import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { User } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<{ products: string[], dispensaries: string[] }>({
    products: [],
    dispensaries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setFavorites({ products: [], dispensaries: [] });
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    
    // Use onSnapshot for real-time updates to favorites across the app
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        setFavorites({
          products: data.favoriteProductIds || [],
          dispensaries: data.favoriteDispensaryIds || []
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("Error listening to user favorites:", err);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const toggleFavorite = async (type: 'product' | 'dispensary', id: string) => {
    if (!auth.currentUser) return;

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const field = type === 'product' ? 'favoriteProductIds' : 'favoriteDispensaryIds';
    const isFavorite = type === 'product' 
      ? favorites.products.includes(id) 
      : favorites.dispensaries.includes(id);

    try {
      await updateDoc(userRef, {
        [field]: isFavorite ? arrayRemove(id) : arrayUnion(id)
      });
    } catch (err) {
      console.error(`Error toggling ${type} favorite:`, err);
    }
  };

  return { favorites, toggleFavorite, loading };
};
