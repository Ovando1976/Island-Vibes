import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Dispensary, Product } from '../types';
import { motion } from 'motion/react';
import { MapPin, Star, ShieldCheck, Clock, Phone, Globe, ArrowLeft, Search, Filter } from 'lucide-react';
import { FavoriteButton } from '../components/FavoriteButton';

const DispensaryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dispensary, setDispensary] = useState<Dispensary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchDispensaryData = async () => {
      if (!id) return;
      try {
        const dSnap = await getDoc(doc(db, 'dispensaries', id));
        if (dSnap.exists()) {
          setDispensary({ id: dSnap.id, ...dSnap.data() } as Dispensary);
          
          // Fetch products for this dispensary
          const pQuery = query(
            collection(db, 'products'),
            where('dispensaryId', '==', id),
            orderBy('createdAt', 'desc')
          );
          const pSnap = await getDocs(pQuery);
          if (!pSnap.empty) {
            setProducts(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
          } else {
            // Mock products for demo if none in DB
            if (id === '1' || id === '2') {
              setProducts([
                { id: 'p1', dispensaryId: id, name: 'Caribbean Kush', brand: 'Island Grown', price: 45, category: 'flower', strainType: 'indica', thc: 22, imageURLs: ['https://images.unsplash.com/photo-1536858225580-4ce91d367ad4?auto=format&fit=crop&w=800&q=80'], description: 'A potent indica strain.', inStock: true } as Product,
                { id: 'p2', dispensaryId: id, name: 'Mango Haze', brand: 'Tropical Terps', price: 55, category: 'vape', strainType: 'sativa', thc: 85, imageURLs: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'], description: 'Sweet mango aroma.', inStock: true } as Product,
              ]);
            }
          }
        } else {
          // Mock dispensary if not in DB for demo
          if (id === '1' || id === '2') {
            const mock = id === '1' 
              ? { id: '1', name: 'Paradise Buds', island: 'St. Thomas', averageRating: 4.8, reviewCount: 124, verified: true, description: 'The premier cannabis destination in Charlotte Amalie.', address: '123 Main St, St. Thomas', pickupAvailable: true, deliveryAvailable: true } as Dispensary
              : { id: '2', name: 'Island High', island: 'St. Croix', averageRating: 4.6, reviewCount: 89, verified: true, description: 'Premium flower and concentrates in Christiansted.', address: '456 King St, St. Croix', pickupAvailable: true, deliveryAvailable: false } as Dispensary;
            setDispensary(mock);
            setProducts([
              { id: 'p1', dispensaryId: id, name: 'Caribbean Kush', brand: 'Island Grown', price: 45, category: 'flower', strainType: 'indica', thc: 22, imageURLs: ['https://images.unsplash.com/photo-1536858225580-4ce91d367ad4?auto=format&fit=crop&w=800&q=80'], description: 'A potent indica strain.', inStock: true } as Product,
              { id: 'p2', dispensaryId: id, name: 'Mango Haze', brand: 'Tropical Terps', price: 55, category: 'vape', strainType: 'sativa', thc: 85, imageURLs: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'], description: 'Sweet mango aroma.', inStock: true } as Product,
            ]);
          } else {
            setError('Dispensary not found');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dispensary');
      } finally {
        setLoading(false);
      }
    };
    fetchDispensaryData();
  }, [id]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" /></div>;
  if (error || !dispensary) return <div className="text-center py-20"><h2 className="text-2xl font-bold mb-4">{error || 'Dispensary not found'}</h2><Link to="/explore" className="text-emerald-400 font-bold hover:underline">Back to Explore</Link></div>;

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <section className="relative h-[300px] md:h-[400px] rounded-[3rem] overflow-hidden">
        <img 
          src={dispensary.coverURL || `https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=1920&q=80`} 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          alt={dispensary.name}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 glass rounded-[2rem] overflow-hidden p-2">
              <img 
                src={dispensary.logoURL || `https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=200&q=80`} 
                className="w-full h-full object-cover rounded-2xl" 
                alt={dispensary.name} 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-black">{dispensary.name}</h1>
                {dispensary.verified && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
              </div>
              <div className="flex items-center gap-4 text-white/60 text-sm font-bold">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                  <span>{dispensary.averageRating} ({dispensary.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{dispensary.island}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <FavoriteButton type="dispensary" id={dispensary.id} className="!p-4 glass rounded-2xl" />
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all">
              Order Pickup
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[2rem] space-y-6">
            <h3 className="text-xl font-bold">About</h3>
            <p className="text-white/60 leading-relaxed">{dispensary.description}</p>
            
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>Open Now • Closes 9:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>{dispensary.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>(340) 555-0123</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-5 h-5 text-emerald-400" />
                <a href="#" className="hover:text-emerald-400 transition-colors">Visit Website</a>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] space-y-4">
            <h3 className="text-xl font-bold">Services</h3>
            <div className="flex flex-wrap gap-2">
              {dispensary.pickupAvailable && (
                <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                  In-Store Pickup
                </span>
              )}
              {dispensary.deliveryAvailable && (
                <span className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                  Delivery
                </span>
              )}
              <span className="glass px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                Curbside
              </span>
            </div>
          </div>
        </aside>

        {/* Main Menu */}
        <main className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-3xl font-black">Menu</h2>
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search menu..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-emerald-500 text-white' : 'glass text-white/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="glass p-4 rounded-3xl flex gap-4 transition-all group-hover:bg-white/10">
                  <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={product.imageURLs[0]} className="w-full h-full object-cover" alt={product.name} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{product.brand}</p>
                      <h3 className="font-bold truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {product.strainType && (
                          <span className="text-[8px] font-bold uppercase text-white/40">{product.strainType}</span>
                        )}
                        {product.thc && (
                          <span className="text-[8px] font-bold uppercase text-white/40">• {product.thc}% THC</span>
                        )}
                      </div>
                    </div>
                    <p className="text-lg font-black">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center glass rounded-[2rem]">
                <p className="text-white/40 italic">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DispensaryDetail;
