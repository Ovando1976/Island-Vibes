import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Product, Dispensary } from '../types';
import { motion } from 'motion/react';
import { Star, MapPin, ShieldCheck, ArrowLeft, ShoppingCart, Heart, Info, Check, Share2, Award, Plus, Package } from 'lucide-react';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewList } from '../components/ReviewList';
import { FavoriteButton } from '../components/FavoriteButton';
import { useCart } from '../hooks/useCart';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [dispensary, setDispensary] = useState<Dispensary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToHumidor, setAddedToHumidor] = useState(false);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleShare = () => {
    if (product) {
      navigate('/social', { state: { sharedProduct: product } });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const pSnap = await getDoc(doc(db, 'products', id));
        if (pSnap.exists()) {
          const pData = { id: pSnap.id, ...pSnap.data() } as Product;
          setProduct(pData);
          
          // Fetch dispensary info
          const dSnap = await getDoc(doc(db, 'dispensaries', pData.dispensaryId));
          if (dSnap.exists()) {
            setDispensary({ id: dSnap.id, ...dSnap.data() } as Dispensary);
          }
        } else {
          // Fallback mock data for demo if not in DB
          if (id.startsWith('p')) {
              const mockProducts: Record<string, Product> = {
                'p1': { 
                  id: 'p1', 
                  dispensaryId: '1', 
                  name: 'Caribbean Kush', 
                  brand: 'Island Grown', 
                  price: 45, 
                  category: 'flower', 
                  strainType: 'indica', 
                  thc: 22, 
                  imageURLs: ['https://images.unsplash.com/photo-1536858225580-4ce91d367ad4?auto=format&fit=crop&w=800&q=80'], 
                  description: 'A potent indica strain with deep tropical notes and a relaxing body high perfect for island sunsets.', 
                  inStock: true, 
                  terpeneProfiles: [
                    { name: 'Myrcene', percentage: 2.4 },
                    { name: 'Caryophyllene', percentage: 1.2 },
                    { name: 'Limonene', percentage: 0.8 }
                  ],
                  lineage: ['OG Kush', 'Island Landrace'],
                  createdAt: Date.now(), 
                  updatedAt: Date.now() 
                } as Product,
                'p2': { 
                  id: 'p2', 
                  dispensaryId: '1', 
                  name: 'Mango Haze', 
                  brand: 'Tropical Terps', 
                  price: 55, 
                  category: 'vape', 
                  strainType: 'sativa', 
                  thc: 85, 
                  imageURLs: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'], 
                  description: 'Sweet mango aroma with an uplifting sativa kick. Great for exploring the islands.', 
                  inStock: true, 
                  terpeneProfiles: [
                    { name: 'Limonene', percentage: 3.1 },
                    { name: 'Pinene', percentage: 1.5 },
                    { name: 'Terpinolene', percentage: 0.9 }
                  ],
                  lineage: ['Haze', 'Skunk #1', 'Northern Lights #5'],
                  createdAt: Date.now(), 
                  updatedAt: Date.now() 
                } as Product,
                'p3': { id: 'p3', dispensaryId: '2', name: 'Coral Reef Gummies', brand: 'Sea Sweets', price: 25, category: 'edible', imageURLs: ['https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=800&q=80'], description: 'Delicious fruit-flavored gummies infused with premium USVI cannabis extract.', inStock: true, createdAt: Date.now(), updatedAt: Date.now() } as Product,
              };
             setProduct(mockProducts[id] || null);
             if (mockProducts[id]) {
                setDispensary({ id: mockProducts[id].dispensaryId, name: mockProducts[id].dispensaryId === '1' ? 'Paradise Buds' : 'Island High', island: 'St. Thomas', verified: true } as Dispensary);
             }
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToHumidor = async () => {
    if (!auth.currentUser || !product) return;
    
    try {
      await addDoc(collection(db, 'humidor'), {
        userId: auth.currentUser.uid,
        productId: product.id,
        productName: product.name,
        brand: product.brand,
        imageURL: product.imageURLs[0],
        quantity: 100,
        createdAt: Date.now()
      });
      setAddedToHumidor(true);
      setTimeout(() => setAddedToHumidor(false), 2000);
    } catch (error) {
      console.error("Error adding to humidor:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">{error || 'Product not found'}</h2>
        <Link to="/explore" className="text-emerald-400 font-bold hover:underline">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Link to="/explore" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square glass rounded-[3rem] overflow-hidden">
            <img 
              src={product.imageURLs[0]} 
              className="w-full h-full object-cover" 
              alt={product.name}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.imageURLs.slice(1).map((url, i) => (
              <div key={i} className="aspect-square glass rounded-2xl overflow-hidden">
                <img src={url} className="w-full h-full object-cover" alt={`${product.name} ${i}`} referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="glass px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                {product.category}
              </span>
              {product.strainType && (
                <span className="glass px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                  {product.strainType}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">{product.name}</h1>
            <p className="text-xl text-white/40 font-bold">{product.brand}</p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Price</p>
              <p className="text-3xl font-black">${product.price}</p>
            </div>
            {product.thc && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">THC</p>
                <p className="text-3xl font-black">{product.thc}%</p>
              </div>
            )}
            {product.cbd && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">CBD</p>
                <p className="text-3xl font-black">{product.cbd}%</p>
              </div>
            )}
          </div>

          <p className="text-lg text-white/70 leading-relaxed">
            {product.description}
          </p>

          {product.name === 'Caribbean Kush' && (
            <div className="glass p-8 rounded-[2rem] space-y-6 border border-white/5">
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-emerald-400">Terpene Profile</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-bold">Myrcene:</span> 2.4%
                  </li>
                  <li className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-bold">Caryophyllene:</span> 1.2%
                  </li>
                  <li className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-bold">Limonene:</span> 0.8%
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-xl font-black uppercase tracking-tighter text-emerald-400">Strain Lineage</h3>
                <div className="flex gap-3">
                  <span className="glass px-4 py-2 rounded-xl text-sm font-bold text-white/70">OG Kush</span>
                  <span className="glass px-4 py-2 rounded-xl text-sm font-bold text-white/70">Island Landrace</span>
                </div>
              </div>
            </div>
          )}

          {dispensary && (
            <Link to={`/dispensary/${dispensary.id}`} className="flex items-center gap-4 glass p-6 rounded-3xl hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Available At</p>
                <p className="font-bold">{dispensary.name}</p>
              </div>
              {dispensary.verified && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            </Link>
          )}

          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className={`flex-1 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                addedToCart ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-6 h-6" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  Reserve for Pickup
                </>
              )}
            </button>
            <button 
              onClick={handleShare}
              className="p-5 glass rounded-2xl hover:bg-white/10 transition-all text-white/60 hover:text-white"
              title="Share to Community"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <button 
              onClick={handleAddToHumidor}
              className={`p-5 rounded-2xl transition-all border ${
                addedToHumidor ? 'bg-emerald-500 border-emerald-500 text-white' : 'glass border-white/10 text-white/60 hover:text-white hover:border-white/20'
              }`}
              title="Add to Digital Humidor"
            >
              {addedToHumidor ? <Check className="w-6 h-6" /> : <Package className="w-6 h-6" />}
            </button>
            <FavoriteButton type="product" id={product.id} className="!p-5 glass rounded-2xl hover:bg-white/10 transition-all" />
          </div>

          {/* Connoisseur's Corner */}
          {(product.terpeneProfiles || product.lineage) && (
            <div className="glass p-8 rounded-[2.5rem] space-y-8 border border-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Connoisseur's Corner</h3>
              </div>

              {product.terpeneProfiles && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Terpene Profile</p>
                  <div className="space-y-3">
                    {product.terpeneProfiles.map((terp) => (
                      <div key={terp.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{terp.name}</span>
                          <span className="text-emerald-400">{terp.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${terp.percentage * 10}%` }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.lineage && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Strain Lineage</p>
                  <div className="flex items-center gap-3">
                    {product.lineage.map((parent, i) => (
                      <React.Fragment key={parent}>
                        <span className="text-sm font-bold glass px-4 py-2 rounded-xl">{parent}</span>
                        {i < (product.lineage?.length || 0) - 1 && <Plus className="w-3 h-3 text-white/20" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl text-xs text-white/40">
            <Info className="w-4 h-4" />
            <span>Inventory is updated every 15 minutes. Prices exclude local taxes.</span>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-white/10">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black">Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                ))}
              </div>
              <span className="font-bold">4.9 / 5.0</span>
            </div>
          </div>
          
          {auth.currentUser ? (
            <ReviewForm productId={product.id} />
          ) : (
            <div className="glass p-8 rounded-[2rem] text-center space-y-4">
              <p className="text-white/60 text-sm">Sign in to share your experience with this product.</p>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all">
                Sign In
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <ReviewList productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
