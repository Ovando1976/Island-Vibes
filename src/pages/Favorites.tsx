import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, MapPin, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useFavorites } from '../hooks/useFavorites';
import { Product, Dispensary } from '../types';
import { FavoriteButton } from '../components/FavoriteButton';

const Favorites: React.FC = () => {
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [favoriteDispensaries, setFavoriteDispensaries] = useState<Dispensary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'dispensaries'>('products');

  useEffect(() => {
    const fetchFavoriteData = async () => {
      if (favoritesLoading) return;
      setLoading(true);

      try {
        // Fetch products
        if (favorites.products.length > 0) {
          const pDocs = await Promise.all(
            favorites.products.map(id => getDoc(doc(db, 'products', id)))
          );
          const products = pDocs
            .filter(d => d.exists())
            .map(d => ({ id: d.id, ...d.data() } as Product));
          
          // Add mock data if some IDs are from the demo
          const demoProducts = favorites.products
            .filter(id => id.startsWith('p'))
            .map(id => {
              const mocks: Record<string, any> = {
                'p1': { id: 'p1', name: 'Caribbean Kush', brand: 'Island Grown', price: 45, category: 'flower', imageURLs: ['https://images.unsplash.com/photo-1536858225580-4ce91d367ad4?auto=format&fit=crop&w=800&q=80'] },
                'p2': { id: 'p2', name: 'Mango Haze', brand: 'Tropical Terps', price: 55, category: 'vape', imageURLs: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'] },
                'p3': { id: 'p3', name: 'Coral Reef Gummies', brand: 'Sea Sweets', price: 25, category: 'edible', imageURLs: ['https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=800&q=80'] },
              };
              return mocks[id];
            })
            .filter(Boolean);

          // Merge and remove duplicates by ID
          const allProducts = [...products, ...demoProducts];
          const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
          setFavoriteProducts(uniqueProducts);
        } else {
          setFavoriteProducts([]);
        }

        // Fetch dispensaries
        if (favorites.dispensaries.length > 0) {
          const dDocs = await Promise.all(
            favorites.dispensaries.map(id => getDoc(doc(db, 'dispensaries', id)))
          );
          const dispensaries = dDocs
            .filter(d => d.exists())
            .map(d => ({ id: d.id, ...d.data() } as Dispensary));

          // Add mock data if some IDs are from the demo
          const demoDispensaries = favorites.dispensaries
            .filter(id => ['1', '2'].includes(id))
            .map(id => {
              const mocks: Record<string, any> = {
                '1': { id: '1', name: 'Paradise Buds', island: 'St. Thomas', averageRating: 4.8, reviewCount: 124, coverURL: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80' },
                '2': { id: '2', name: 'Island High', island: 'St. Croix', averageRating: 4.6, reviewCount: 89, coverURL: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
              };
              return mocks[id];
            })
            .filter(Boolean);

          const allDispensaries = [...dispensaries, ...demoDispensaries];
          const uniqueDispensaries = Array.from(new Map(allDispensaries.map(d => [d.id, d])).values());
          setFavoriteDispensaries(uniqueDispensaries);
        } else {
          setFavoriteDispensaries([]);
        }
      } catch (err) {
        console.error("Error fetching favorite data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteData();
  }, [favorites, favoritesLoading]);

  if (!auth.currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-white/20" />
        </div>
        <h1 className="text-3xl font-black mb-4">Your Favorites</h1>
        <p className="text-white/60 max-w-md mb-8">Sign in to save and view your favorite products and dispensaries.</p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">Saved Items</h1>
          <p className="text-white/60">Your personal collection of island favorites.</p>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <ShoppingBag className="w-4 h-4" />
            Products ({favorites.products.length})
          </button>
          <button 
            onClick={() => setActiveTab('dispensaries')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'dispensaries' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <MapPin className="w-4 h-4" />
            Shops ({favorites.dispensaries.length})
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass h-64 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'products' ? (
            favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {favoriteProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} className="group relative">
                    <div className="glass rounded-3xl overflow-hidden transition-all group-hover:bg-white/10">
                      <div className="aspect-square bg-white/5 relative">
                        <img src={product.imageURLs[0]} className="w-full h-full object-cover" alt={product.name} referrerPolicy="no-referrer" />
                        <div className="absolute top-2 right-2">
                          <FavoriteButton type="product" id={product.id} className="glass !bg-black/20" />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{product.brand}</p>
                        <h3 className="text-sm font-bold truncate mb-2">{product.name}</h3>
                        <p className="text-lg font-black">${product.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState type="products" />
            )
          ) : (
            favoriteDispensaries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteDispensaries.map((shop) => (
                  <Link key={shop.id} to={`/dispensary/${shop.id}`} className="group relative">
                    <div className="glass rounded-[2rem] overflow-hidden transition-all group-hover:scale-[1.02] group-hover:border-emerald-500/50">
                      <div className="h-40 bg-white/5 relative">
                        <img src={shop.coverURL || `https://picsum.photos/seed/${shop.id}/600/300`} className="w-full h-full object-cover" alt={shop.name} referrerPolicy="no-referrer" />
                        <div className="absolute top-4 right-4 flex gap-2 items-center">
                          <FavoriteButton type="dispensary" id={shop.id} className="glass !bg-black/20" />
                          <div className="glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {shop.island}
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-1">{shop.name}</h3>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                          <span>{shop.averageRating} ({shop.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState type="dispensaries" />
            )
          )}
        </>
      )}
    </div>
  );
};

const EmptyState = ({ type }: { type: string }) => (
  <div className="text-center py-20 glass rounded-[3rem] space-y-6">
    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
      <Heart className="w-8 h-8 text-white/10" />
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">No favorite {type} yet</h3>
      <p className="text-white/40 max-w-xs mx-auto">Start exploring and tap the heart icon to save items you love.</p>
    </div>
    <Link to="/explore" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:gap-3 transition-all">
      <span>Go Exploring</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);

export default Favorites;
