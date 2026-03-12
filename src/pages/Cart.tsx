import React from 'react';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, MapPin, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert("Please sign in to complete your order.");
      return;
    }

    if (cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      // Create order in Firestore
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          dispensaryId: item.dispensaryId
        })),
        totalPrice,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      clearCart();
      navigate('/profile');
      alert("Order placed successfully! You can track it in your profile.");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-white/20" />
        </div>
        <h1 className="text-4xl font-black mb-4">Your Cart is Empty</h1>
        <p className="text-white/60 max-w-md mb-8">Looks like you haven't added any island treasures to your cart yet.</p>
        <Link to="/explore" className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold transition-all">
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl font-black mb-2">Your Cart</h1>
        <p className="text-white/60">Review your items and prepare for pickup.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={item.id}
                className="glass p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.imageURLs[0]} className="w-full h-full object-cover" alt={item.name} />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{item.brand}</p>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-sm text-white/40">{item.category} • {item.strainType || 'N/A'}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center glass rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <p className="text-xl font-black">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] text-white/40">${item.price.toFixed(2)} each</p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-white/20 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <aside className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-2xl font-bold">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-white/60">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Estimated Tax</span>
                <span>$0.00</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="font-bold">Total</span>
                <span className="text-3xl font-black text-emerald-400">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-3 text-xs text-white/40">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <p>Items will be reserved for in-store pickup at their respective dispensaries.</p>
              </div>
              <div className="flex items-start gap-3 text-xs text-white/40">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <p>Please allow 30-60 minutes for dispensaries to confirm and prepare your order.</p>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {isCheckingOut ? 'Processing...' : (
                <>
                  <span>Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <Link to="/explore" className="block text-center text-sm font-bold text-white/40 hover:text-white transition-all">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
