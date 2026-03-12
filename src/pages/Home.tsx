import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, MapPin, TrendingUp, Clock, Star, ArrowRight, ShieldCheck, Plus, Minus, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Dispensary, Product } from '../types';
import { FavoriteButton } from '../components/FavoriteButton';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, Check } from 'lucide-react';

const Home: React.FC = () => {
  const [featuredDispensaries, setFeaturedDispensaries] = useState<Dispensary[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = productQuantities[product.id] || 1;
    addToCart(product, qty);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const updateProductQty = (e: React.MouseEvent, productId: string, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dSnap = await getDocs(query(collection(db, 'dispensaries'), limit(4)));
        const pSnap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(6)));
        
        if (!dSnap.empty) {
          setFeaturedDispensaries(dSnap.docs.map(d => ({ id: d.id, ...d.data() } as Dispensary)));
        } else {
          setFeaturedDispensaries([
            { id: '1', name: 'Paradise Buds', island: 'St. Thomas', averageRating: 4.8, reviewCount: 124, slug: 'paradise-buds', verified: true, coverURL: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80' } as Dispensary,
            { id: '2', name: 'Island High', island: 'St. Croix', averageRating: 4.6, reviewCount: 89, slug: 'island-high', verified: true, coverURL: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' } as Dispensary,
            { id: '3', name: 'Coral Bay Cannabis', island: 'St. John', averageRating: 4.9, reviewCount: 56, verified: true, coverURL: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' } as Dispensary,
            { id: '4', name: 'Cruz Bay Greens', island: 'St. John', averageRating: 4.5, reviewCount: 42, verified: false, coverURL: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80' } as Dispensary,
          ]);
        }

        if (!pSnap.empty) {
          setTrendingProducts(pSnap.docs.map(p => ({ id: p.id, ...p.data() } as Product)));
        } else {
          setTrendingProducts([
            { id: 'p1', name: 'Caribbean Kush', brand: 'Island Grown', price: 45, category: 'flower', strainType: 'indica', thc: 22, imageURLs: ['https://images.unsplash.com/photo-1536858225580-4ce91d367ad4?auto=format&fit=crop&w=800&q=80'] } as Product,
            { id: 'p2', name: 'Mango Haze', brand: 'Tropical Terps', price: 55, category: 'vape', strainType: 'sativa', thc: 85, imageURLs: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'] } as Product,
            { id: 'p3', name: 'Coral Reef Gummies', brand: 'Sea Sweets', price: 25, category: 'edible', imageURLs: ['https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=800&q=80'] } as Product,
            { id: 'p4', name: 'Island Punch', brand: 'USVI Extracts', price: 60, category: 'concentrate', strainType: 'hybrid', thc: 78, imageURLs: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80'] } as Product,
            { id: 'p5', name: 'Sunset Sherbet', brand: 'Island Grown', price: 50, category: 'flower', strainType: 'hybrid', thc: 20, imageURLs: ['https://images.unsplash.com/photo-1556928283-8a3a19106f4a?auto=format&fit=crop&w=800&q=80'] } as Product,
            { id: 'p6', name: 'Ocean Mist', brand: 'Tropical Terps', price: 40, category: 'preroll', strainType: 'sativa', thc: 18, imageURLs: ['https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80'] } as Product,
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden flex items-center px-8 md:px-16">
        <img 
          src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=1920&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          alt="USVI Landscape"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>USVI's Premier Cannabis Guide</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              The Connoisseur's <br />
              <span className="text-emerald-400 italic">Island</span> Guide
            </h1>
            <p className="text-xl text-white/70 max-w-xl leading-relaxed">
              Your gateway to the finest local flower, artisanal extracts, and the vibrant cannabis culture of the U.S. Virgin Islands.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Search strains, shops, or moods..."
                  className="w-full h-16 glass rounded-2xl pl-16 pr-6 focus:outline-none focus:border-emerald-500/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 h-16 rounded-2xl font-bold transition-all active:scale-95">
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Satellite Overview Section */}
      <section className="space-y-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Globe className="text-emerald-400 w-8 h-8" />
              Island Satellite Overview
            </h2>
            <p className="text-white/40">A real-world look at the territory from above.</p>
          </div>
          <Link to="/explore?tab=map" className="group flex items-center gap-2 text-emerald-400 font-bold text-sm hover:gap-3 transition-all">
            <span>Explore Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'St. Thomas', 
              coords: [18.3419, -64.9307], 
              desc: 'The bustling hub of the USVI, home to Charlotte Amalie and premier retail shops.',
              img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80'
            },
            { 
              name: 'St. John', 
              coords: [18.3483, -64.7139], 
              desc: 'The "Emerald Isle" - mostly national park with boutique dispensaries in Cruz Bay.',
              img: 'https://images.unsplash.com/photo-1506929662033-753939090bb2?auto=format&fit=crop&w=800&q=80'
            },
            { 
              name: 'St. Croix', 
              coords: [17.7466, -64.7032], 
              desc: 'The largest island, known for its fertile valleys and artisanal cultivation.',
              img: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80'
            },
          ].map((island) => (
            <div key={island.name} className="group glass rounded-[3rem] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all">
              <div className="h-64 relative">
                <img 
                  src={island.img} 
                  className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" 
                  alt={island.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-black">{island.name}</h3>
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Satellite View Available</p>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-sm text-white/60 leading-relaxed">{island.desc}</p>
                <Link 
                  to={`/explore?tab=map&island=${encodeURIComponent(island.name)}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-emerald-400 transition-colors"
                >
                  View on Satellite Map
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Dispensaries */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              <MapPin className="text-emerald-400 w-8 h-8" />
              Featured Dispensaries
            </h2>
            <p className="text-white/40">The most trusted licensed shops in the territory.</p>
          </div>
          <Link to="/explore" className="group flex items-center gap-2 text-emerald-400 font-bold text-sm hover:gap-3 transition-all">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass h-72 rounded-[2.5rem] animate-pulse" />
            ))
          ) : (
            featuredDispensaries.map((shop) => (
              <Link key={shop.id} to={`/dispensary/${shop.id}`} className="group">
                <div className="glass rounded-[2.5rem] overflow-hidden transition-all group-hover:scale-[1.02] group-hover:border-emerald-500/50 h-full flex flex-col">
                  <div className="h-48 bg-white/5 relative">
                    <img src={shop.coverURL || `https://picsum.photos/seed/${shop.id}/600/400`} className="w-full h-full object-cover" alt={shop.name} referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 flex gap-2 items-center">
                      <FavoriteButton type="dispensary" id={shop.id} className="glass !bg-black/20" />
                      <div className="glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {shop.island}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold">{shop.name}</h3>
                        {shop.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                        <span className="font-bold">{shop.averageRating}</span>
                        <span className="text-white/20">•</span>
                        <span>{shop.reviewCount} reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Terpene Explorer */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-4xl font-black">Decode the Terpenes</h2>
          <p className="text-white/40">It's not just about THC. Understand the aromatic compounds that define your experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Myrcene', scent: 'Earthy, Musky', effect: 'Deep Relaxation', color: 'border-orange-500/30 bg-orange-500/5' },
            { name: 'Limonene', scent: 'Citrus, Lemon', effect: 'Mood Elevation', color: 'border-yellow-500/30 bg-yellow-500/5' },
            { name: 'Linalool', scent: 'Floral, Lavender', effect: 'Stress Relief', color: 'border-purple-500/30 bg-purple-500/5' },
          ].map((terp) => (
            <div key={terp.name} className={`p-8 rounded-[2.5rem] border ${terp.color} space-y-4 hover:scale-[1.02] transition-all cursor-default`}>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{terp.name}</h3>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold">
                  {terp.name[0]}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Aroma Profile</p>
                <p className="text-sm">{terp.scent}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Primary Effect</p>
                <p className="text-sm font-bold text-emerald-400">{terp.effect}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mood-to-menu Section */}
      <section className="glass p-12 md:p-16 rounded-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[100px] -z-10" />
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl font-black mb-4">Shop by Mood</h2>
          <p className="text-xl text-white/40">Find the perfect match for your island vibe.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
          {[
            { label: 'Relax', icon: '🌴', color: 'bg-blue-500/10 text-blue-400' },
            { label: 'Sleep', icon: '🌙', color: 'bg-indigo-500/10 text-indigo-400' },
            { label: 'Focus', icon: '🎯', color: 'bg-emerald-500/10 text-emerald-400' },
            { label: 'Creative', icon: '🎨', color: 'bg-purple-500/10 text-purple-400' },
            { label: 'Social', icon: '🤝', color: 'bg-orange-500/10 text-orange-400' },
            { label: 'Pain Relief', icon: '🩹', color: 'bg-red-500/10 text-red-400' },
            { label: 'Beginner', icon: '🌱', color: 'bg-yellow-500/10 text-yellow-400' },
          ].map((mood) => (
            <button key={mood.label} className={`glass p-8 rounded-[2.5rem] text-center space-y-4 hover:scale-105 transition-all group ${mood.color}`}>
              <span className="text-4xl block group-hover:animate-bounce">{mood.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest block">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              <TrendingUp className="text-emerald-400 w-8 h-8" />
              Trending Products
            </h2>
            <p className="text-white/40">Top-rated strains and edibles available now.</p>
          </div>
          <Link to="/explore?tab=products" className="group flex items-center gap-2 text-emerald-400 font-bold text-sm hover:gap-3 transition-all">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass aspect-[3/4] rounded-3xl animate-pulse" />
            ))
          ) : (
            trendingProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="glass rounded-[2rem] overflow-hidden transition-all group-hover:bg-white/10 h-full flex flex-col">
                  <div className="aspect-square bg-white/5 relative">
                    <img src={product.imageURLs[0]} className="w-full h-full object-cover" alt={product.name} referrerPolicy="no-referrer" />
                    <div className="absolute top-3 right-3">
                      <FavoriteButton type="product" id={product.id} className="glass !bg-black/20" />
                    </div>
                    {product.strainType && (
                      <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                        {product.strainType}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{product.brand}</p>
                      <h3 className="text-sm font-bold truncate mb-2">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xl font-black">${product.price}</p>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white/5 rounded-xl p-1">
                          <button 
                            onClick={(e) => updateProductQty(e, product.id, -1)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold">
                            {productQuantities[product.id] || 1}
                          </span>
                          <button 
                            onClick={(e) => updateProductQty(e, product.id, 1)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`p-2 rounded-xl transition-all ${
                            addedId === product.id ? 'bg-emerald-500 text-white' : 'bg-white/5 hover:bg-emerald-500 text-white/40 hover:text-white'
                          }`}
                        >
                          {addedId === product.id ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-emerald-500 rounded-[4rem] p-12 md:p-20 text-center space-y-8">
        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
          Join the USVI <br /> Cannabis Community
        </h2>
        <p className="text-white/80 text-xl max-w-2xl mx-auto">
          Get exclusive access to new product drops, dispensary deals, and local cannabis news delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 h-16 rounded-2xl px-6 text-black font-bold focus:outline-none"
          />
          <button className="bg-black text-white px-10 h-16 rounded-2xl font-bold hover:bg-black/80 transition-all">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
