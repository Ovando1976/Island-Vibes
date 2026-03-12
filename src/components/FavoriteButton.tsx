import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { motion } from 'motion/react';
import { auth } from '../firebase';

interface FavoriteButtonProps {
  type: 'product' | 'dispensary';
  id: string;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ type, id, className = "" }) => {
  const { favorites, toggleFavorite } = useFavorites();
  
  const isFavorite = type === 'product' 
    ? favorites.products.includes(id) 
    : favorites.dispensaries.includes(id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth.currentUser) {
      // Could trigger a login modal here
      alert("Please sign in to save favorites.");
      return;
    }
    toggleFavorite(type, id);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all ${
        isFavorite 
          ? 'bg-pink-500/20 text-pink-500' 
          : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
      } ${className}`}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500' : ''}`} />
    </motion.button>
  );
};
