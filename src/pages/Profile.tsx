import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Package, Heart, Star, ShieldCheck, Clock } from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useFavorites } from '../hooks/useFavorites';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

const Profile: React.FC = () => {
  const user = auth.currentUser;
  const { favorites } = useFavorites();
  const [orders, setOrders] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [humidorItems, setHumidorItems] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingJournal, setLoadingJournal] = useState(true);
  const [loadingHumidor, setLoadingHumidor] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'journal' | 'humidor'>('orders');

  useEffect(() => {
    if (!user) return;

    // Fetch Orders
    const ordersQ = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeOrders = onSnapshot(ordersQ, (snapshot) => {
      const orderData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(orderData);
      setLoadingOrders(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoadingOrders(false);
    });

    // Fetch Journal Entries
    const journalQ = query(
      collection(db, 'journal_entries'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeJournal = onSnapshot(journalQ, (snapshot) => {
      const journalData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJournalEntries(journalData);
      setLoadingJournal(false);
    }, (error) => {
      console.error("Error fetching journal:", error);
      setLoadingJournal(false);
    });

    // Fetch Humidor Items
    const humidorQ = query(
      collection(db, 'humidor'),
      where('userId', '==', user.uid)
    );

    const unsubscribeHumidor = onSnapshot(humidorQ, (snapshot) => {
      const humidorData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHumidorItems(humidorData);
      setLoadingHumidor(false);
    }, (error) => {
      console.error("Error fetching humidor:", error);
      setLoadingHumidor(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeJournal();
      unsubscribeHumidor();
    };
  }, [user]);

  const handleSignOut = () => {
    signOut(auth);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Not Signed In</h2>
        <p className="text-white/60 mb-8 max-w-xs">Sign in to track orders, save favorites, and join the community.</p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all">
          Sign In with Google
        </button>
      </div>
    );
  }

  const totalFavorites = favorites.products.length + favorites.dispensaries.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <header className="glass p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img 
            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
            className="w-32 h-32 rounded-full border-4 border-emerald-500/20"
            alt="Profile"
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full border-4 border-[#0a0a0a]">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-black mb-2">{user.displayName}</h1>
          <p className="text-white/60 mb-4">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="glass px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-400">
              verified patient
            </span>
            <span className="glass px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              st. thomas
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-4 glass rounded-2xl hover:bg-white/10 transition-all">
            <Settings className="w-6 h-6" />
          </button>
          <button onClick={handleSignOut} className="p-4 glass rounded-2xl hover:bg-red-500/20 text-red-400 transition-all">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Stats/Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Package, label: 'Orders', value: orders.length.toString(), color: 'text-blue-400' },
          { icon: Heart, label: 'Favorites', value: totalFavorites.toString(), color: 'text-pink-400' },
          { icon: Star, label: 'Journal', value: journalEntries.length.toString(), color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[2rem] text-center space-y-2">
            <stat.icon className={`w-6 h-6 mx-auto ${stat.color}`} />
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="space-y-6">
        <div className="flex p-1 bg-white/5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Order History
          </button>
          <button 
            onClick={() => setActiveTab('journal')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'journal' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Strain Journal
          </button>
          <button 
            onClick={() => setActiveTab('humidor')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'humidor' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Digital Humidor
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'orders' ? (
            loadingOrders ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="glass p-6 rounded-3xl animate-pulse h-24" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="glass p-12 rounded-[2rem] text-center">
                <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 italic">No orders yet. Start shopping to see your history!</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="glass p-6 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-white/40">
                      {order.items.length} items • ${order.totalPrice?.toFixed(2) || '0.00'} • {order.createdAt ? formatDistanceToNow(order.createdAt.toDate()) + ' ago' : 'Just now'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      order.status === 'pending' ? 'bg-brand-gold/10 text-brand-gold' :
                      'bg-white/5 text-white/40'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )
          ) : activeTab === 'journal' ? (
            loadingJournal ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="glass p-6 rounded-3xl animate-pulse h-24" />
                ))}
              </div>
            ) : journalEntries.length === 0 ? (
              <div className="glass p-12 rounded-[2rem] text-center space-y-4">
                <Star className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 italic">Your journal is empty. Track your sessions to remember your favorites!</p>
                <button className="bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full text-xs font-bold hover:bg-emerald-500/20 transition-all">
                  Start a Journal Entry
                </button>
              </div>
            ) : (
              journalEntries.map((entry) => (
                <div key={entry.id} className="glass p-8 rounded-[2.5rem] space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{entry.productName}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        {entry.createdAt ? formatDistanceToNow(entry.createdAt) + ' ago' : 'Just now'}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= entry.rating ? 'text-brand-gold fill-brand-gold' : 'text-white/10'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.effects.map((effect: string) => (
                      <span key={effect} className="text-[10px] font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                        {effect}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-white/60 italic leading-relaxed">"{entry.notes}"</p>
                </div>
              ))
            )
          ) : (
            loadingHumidor ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="glass p-6 rounded-3xl animate-pulse h-24" />
                ))}
              </div>
            ) : humidorItems.length === 0 ? (
              <div className="glass p-12 rounded-[2rem] text-center space-y-4">
                <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 italic">Your humidor is empty. Add products to track your current stash!</p>
                <Link to="/explore" className="inline-block bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full text-xs font-bold hover:bg-emerald-500/20 transition-all">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {humidorItems.map((item) => (
                  <div key={item.id} className="glass p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl overflow-hidden">
                      <img src={item.imageURL} className="w-full h-full object-cover" alt={item.productName} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.productName}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{item.brand}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${item.quantity}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-white/60">{item.quantity}% left</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
