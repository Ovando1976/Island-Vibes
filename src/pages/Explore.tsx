import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Grid, List as ListIcon, Star, TrendingUp } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Island, Category, Dispensary, Product } from '../types';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FavoriteButton } from '../components/FavoriteButton';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, Check } from 'lucide-react';

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [island, setIsland] = useState<Island | 'All'>('All');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'dispensaries' | 'products' | 'map'>((searchParams.get('tab') as any) || 'dispensaries');
  const [mapType, setMapType] = useState<'stylized' | 'real' | 'satellite'>('stylized');
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal) setSearch(searchVal);
    const tabVal = searchParams.get('tab');
    if (tabVal === 'products' || tabVal === 'dispensaries') setActiveTab(tabVal);
  }, [searchParams]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const islands: (Island | 'All')[] = ['All', 'St. Thomas', 'St. John', 'St. Croix'];
  const categories: (Category | 'All')[] = ['All', 'flower', 'preroll', 'edible', 'vape', 'concentrate', 'tincture', 'accessory'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'dispensaries') {
          let q = query(collection(db, 'dispensaries'), orderBy('name'));
          if (island !== 'All') {
            q = query(q, where('island', '==', island));
          }
          const snap = await getDocs(q);
          if (!snap.empty) {
            setDispensaries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Dispensary)));
          } else {
            // Mock data for demo with coordinates
            const mocks = [
              { id: '1', name: 'Paradise Buds', island: 'St. Thomas', averageRating: 4.8, reviewCount: 124, verified: true, latitude: 18.3419, longitude: -64.9307, coverURL: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80' },
              { id: '2', name: 'Island High', island: 'St. Croix', averageRating: 4.6, reviewCount: 89, verified: true, latitude: 17.7466, longitude: -64.7032, coverURL: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
              { id: '3', name: 'Coral Bay Cannabis', island: 'St. John', averageRating: 4.9, reviewCount: 56, verified: true, latitude: 18.3483, longitude: -64.7139, coverURL: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
              { id: '4', name: 'Cruz Bay Greens', island: 'St. John', averageRating: 4.5, reviewCount: 42, verified: false, latitude: 18.3308, longitude: -64.7936, coverURL: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80' },
            ] as Dispensary[];
            setDispensaries(island === 'All' ? mocks : mocks.filter(m => m.island === island));
          }
        } else {
          let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
          if (category !== 'All') {
            q = query(q, where('category', '==', category));
          }
          const snap = await getDocs(q);
          if (!snap.empty) {
            setProducts(snap.docs.map(p => ({ id: p.id, ...p.data() } as Product)));
          } else {
            // Mock data for demo
            const mocks = [
              { id: 'p1', name: 'Caribbean Kush', brand: 'Island Grown', price: 45, category: 'flower', strainType: 'indica', thc: 22, imageURLs: ['https://images.unsplash.com/photo-1536858225580-4ce91d367ad4?auto=format&fit=crop&w=800&q=80'] },
              { id: 'p2', name: 'Mango Haze', brand: 'Tropical Terps', price: 55, category: 'vape', strainType: 'sativa', thc: 85, imageURLs: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'] },
              { id: 'p3', name: 'Coral Reef Gummies', brand: 'Sea Sweets', price: 25, category: 'edible', imageURLs: ['https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=800&q=80'] },
            ] as Product[];
            setProducts(category === 'All' ? mocks : mocks.filter(m => m.category === category));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, island, category]);

  const filteredDispensaries = dispensaries.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  // Custom Leaflet Marker Icon
  const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Map Center Logic
  const getMapCenter = () => {
    if (island === 'St. Thomas') return [18.3419, -64.9307] as [number, number];
    if (island === 'St. John') return [18.3483, -64.7139] as [number, number];
    if (island === 'St. Croix') return [17.7466, -64.7032] as [number, number];
    return [18.0, -64.8] as [number, number]; // Territory center
  };

  // Map Updater Component
  const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <h1 className="text-4xl font-black">Explore USVI Cannabis</h1>
        
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <input 
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full h-16 glass rounded-2xl pl-16 pr-6 focus:outline-none focus:border-emerald-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {activeTab === 'dispensaries' ? (
              <div className="flex gap-2">
                {islands.map(i => (
                  <button
                    key={i}
                    onClick={() => setIsland(i)}
                    className={`h-16 px-6 glass rounded-2xl font-bold whitespace-nowrap transition-all ${island === i ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`h-16 px-6 glass rounded-2xl font-bold whitespace-nowrap transition-all uppercase text-[10px] tracking-widest ${category === c ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white/5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('dispensaries')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dispensaries' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Dispensaries
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'map' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Map View
          </button>
        </div>
      </header>

      {/* Results Grid / Map */}
      <div className="min-h-[60vh]">
        {activeTab === 'map' ? (
          <div className="glass rounded-[3rem] p-4 lg:p-8 min-h-[600px] relative overflow-hidden flex flex-col space-y-8">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] -z-10" />
            
            {/* Map Header / Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black">Interactive Island Guide</h3>
                <p className="text-white/40 text-xs">Explore verified dispensaries across the USVI.</p>
              </div>
              <div className="flex p-1 bg-white/5 rounded-xl">
                <button 
                  onClick={() => setMapType('stylized')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mapType === 'stylized' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
                >
                  Artistic
                </button>
                <button 
                  onClick={() => setMapType('real')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mapType === 'real' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
                >
                  Real-World
                </button>
                <button 
                  onClick={() => setMapType('satellite')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mapType === 'satellite' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {mapType === 'stylized' ? (
              <div className="relative w-full max-w-4xl aspect-[2/1] mx-auto flex items-center justify-center">
                <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl">
                  {/* St. Thomas */}
                  <motion.path
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: island === 'St. Thomas' || island === 'All' ? 1 : 0.2, pathLength: 1 }}
                    d="M150,100 C180,80 220,90 250,110 C280,130 260,160 230,170 C200,180 160,170 140,150 C120,130 130,110 150,100"
                    fill="currentColor"
                    className={`${island === 'St. Thomas' ? 'text-emerald-500/20' : 'text-white/5'} transition-colors cursor-pointer`}
                    onClick={() => setIsland('St. Thomas')}
                  />
                  
                  {/* St. John */}
                  <motion.path
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: island === 'St. John' || island === 'All' ? 1 : 0.2, pathLength: 1 }}
                    d="M320,120 C340,110 370,115 390,130 C410,145 400,170 380,180 C360,190 330,185 315,170 C300,155 310,130 320,120"
                    fill="currentColor"
                    className={`${island === 'St. John' ? 'text-emerald-500/20' : 'text-white/5'} transition-colors cursor-pointer`}
                    onClick={() => setIsland('St. John')}
                  />

                  {/* St. Croix */}
                  <motion.path
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: island === 'St. Croix' || island === 'All' ? 1 : 0.2, pathLength: 1 }}
                    d="M450,280 C500,260 580,270 620,290 C660,310 640,350 600,360 C550,375 480,360 450,330 C420,300 430,290 450,280"
                    fill="currentColor"
                    className={`${island === 'St. Croix' ? 'text-emerald-500/20' : 'text-white/5'} transition-colors cursor-pointer`}
                    onClick={() => setIsland('St. Croix')}
                  />

                  {/* Markers */}
                  {dispensaries.map((shop, idx) => {
                    let coords = { x: 0, y: 0 };
                    if (shop.island === 'St. Thomas') coords = { x: 200 + (idx * 10), y: 130 + (idx * 5) };
                    if (shop.island === 'St. John') coords = { x: 350 + (idx * 5), y: 150 + (idx * 5) };
                    if (shop.island === 'St. Croix') coords = { x: 540 + (idx * 15), y: 320 + (idx * 5) };

                    return (
                      <g 
                        key={shop.id} 
                        className="cursor-pointer group"
                        onClick={() => navigate(`/dispensary/${shop.id}`)}
                      >
                        <circle cx={coords.x} cy={coords.y} r="12" className="fill-emerald-500/20 group-hover:fill-emerald-500/40 transition-all" />
                        <circle cx={coords.x} cy={coords.y} r="4" className="fill-emerald-500 group-hover:scale-150 transition-all origin-center" />
                        <foreignObject x={coords.x - 60} y={coords.y - 45} width="120" height="40" className="overflow-visible opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                          <div className="glass px-3 py-1.5 rounded-xl text-[10px] font-bold text-center border border-emerald-500/30 whitespace-nowrap">
                            {shop.name}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}
                </svg>

                {/* Island Labels */}
                <div className="absolute top-[10%] left-[20%] text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pointer-events-none">St. Thomas</div>
                <div className="absolute top-[15%] left-[45%] text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pointer-events-none">St. John</div>
                <div className="absolute bottom-[15%] right-[25%] text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pointer-events-none">St. Croix</div>
              </div>
            ) : (
              <div className="h-[600px] rounded-[2rem] overflow-hidden border border-white/10 relative z-0 bg-[#0a0a0a]">
                <MapContainer 
                  key={mapType}
                  center={getMapCenter()} 
                  zoom={island === 'All' ? 10 : 12} 
                  className="w-full h-full"
                  scrollWheelZoom={false}
                >
                  {mapType === 'real' ? (
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                  ) : (
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    />
                  )}
                  {dispensaries.filter(d => d.latitude && d.longitude).map(shop => (
                    <Marker 
                      key={shop.id} 
                      position={[shop.latitude!, shop.longitude!]} 
                      icon={customIcon}
                    >
                      <Popup className="custom-popup">
                        <div className="p-2 space-y-2">
                          <h4 className="font-bold text-emerald-500">{shop.name}</h4>
                          <p className="text-[10px] text-white/60">{shop.island}</p>
                          <Link 
                            to={`/dispensary/${shop.id}`}
                            className="block w-full bg-emerald-500 text-white text-center py-1 rounded-lg text-[10px] font-bold"
                          >
                            View Menu
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <MapUpdater center={getMapCenter()} zoom={island === 'All' ? 10 : 12} />
                </MapContainer>
              </div>
            )}

            <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-6">
              <div className="flex gap-3">
                {islands.map(i => (
                  <button
                    key={i}
                    onClick={() => setIsland(i)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      island === i ? 'bg-emerald-500 border-emerald-500 text-white' : 'glass border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass rounded-[2rem] overflow-hidden animate-pulse">
                  <div className="h-48 bg-white/5" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {activeTab === 'dispensaries' ? (
                  filteredDispensaries.map((shop) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={shop.id}
                    >
                      <Link to={`/dispensary/${shop.id}`} className="group block h-full">
                        <div className="glass rounded-[2rem] overflow-hidden transition-all group-hover:scale-[1.02] group-hover:border-emerald-500/50 h-full flex flex-col">
                          <div className="h-40 bg-white/5 relative">
                            <img src={shop.coverURL || `https://picsum.photos/seed/${shop.id}/600/300`} className="w-full h-full object-cover" alt={shop.name} referrerPolicy="no-referrer" />
                            <div className="absolute top-4 right-4 flex gap-2 items-center">
                              <FavoriteButton type="dispensary" id={shop.id} className="glass !bg-black/20" />
                              <div className="glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {shop.island}
                              </div>
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{shop.name}</h3>
                              <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                                <span>{shop.averageRating} ({shop.reviewCount} reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={product.id}
                    >
                      <Link to={`/product/${product.id}`} className="group block h-full">
                        <div className="glass rounded-3xl overflow-hidden transition-all group-hover:bg-white/10 h-full flex flex-col">
                          <div className="aspect-square bg-white/5 relative">
                            <img src={product.imageURLs[0]} className="w-full h-full object-cover" alt={product.name} referrerPolicy="no-referrer" />
                            <div className="absolute top-2 right-2">
                              <FavoriteButton type="product" id={product.id} className="glass !bg-black/20" />
                            </div>
                            {product.strainType && (
                              <div className="absolute bottom-2 left-2 glass px-2 py-1 rounded-lg text-[8px] font-bold uppercase">
                                {product.strainType}
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{product.brand}</p>
                              <h3 className="text-sm font-bold truncate mb-2">{product.name}</h3>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-lg font-black">${product.price}</p>
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
                      </Link>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      {!loading && (activeTab === 'dispensaries' ? filteredDispensaries : filteredProducts).length === 0 && (
        <div className="text-center py-20 glass rounded-[3rem]">
          <p className="text-white/40 italic">No results found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
