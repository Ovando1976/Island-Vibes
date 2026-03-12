import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, increment, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import { Post, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Share2, Image as ImageIcon, Send, User as UserIcon, X, TrendingUp, Map, Award, Hash, Clock, Flame, Wind } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useLocation, Link } from 'react-router-dom';

const Social: React.FC = () => {
  const location = useLocation();
  const sharedProduct = location.state?.sharedProduct as Product | undefined;
  
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'islands'>('all');
  const [newPostText, setNewPostText] = useState(sharedProduct ? `Check out this ${sharedProduct.name} from ${sharedProduct.brand}! 🌿🔥` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(sharedProduct?.imageURLs?.[0] || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    if (activeTab === 'trending') {
      q = query(collection(db, 'posts'), orderBy('likesCount', 'desc'), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching posts:", err);
      setPosts([
        { id: '1', userId: 'u1', userName: 'IslandVibes', userPhoto: '', text: 'Just tried the Caribbean Kush from Paradise Buds. Incredible body high! 🌴🔥', likesCount: 12, likedBy: [], createdAt: Date.now() - 3600000 },
        { id: '2', userId: 'u2', userName: 'StThomasLocal', userPhoto: '', text: 'Cruz Bay Greens has a new batch of Mango Haze. The terps are insane! 🥭💨', imageURLs: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80'], likesCount: 24, likedBy: [], createdAt: Date.now() - 7200000 },
      ]);
      setLoading(false);
    });

    return unsubscribe;
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || (!newPostText.trim() && !imageFile)) return;

    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (imageFile && !sharedProduct) {
        const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      } else if (sharedProduct) {
        imageUrls = sharedProduct.imageURLs;
      }

      await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || '',
        text: newPostText,
        imageURLs: imageUrls,
        likesCount: 0,
        likedBy: [],
        sharedProductId: sharedProduct?.id || null,
        createdAt: Date.now(),
      });

      setNewPostText('');
      setImageFile(null);
      setImagePreview(null);
      // Clear location state after posting
      window.history.replaceState({}, document.title);
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!auth.currentUser) return;
    
    const postRef = doc(db, 'posts', postId);
    try {
      await updateDoc(postRef, {
        likesCount: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
      });
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleSmokeSignal = async () => {
    if (!auth.currentUser) return;
    
    try {
      await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous Enthusiast',
        userPhoto: auth.currentUser.photoURL || '',
        text: "🔥 Just sent a Smoke Signal! Currently enjoying a session in paradise. Who's with me? 🌴",
        likesCount: 0,
        likedBy: [],
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Error sending smoke signal:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar - Navigation & Stats */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="glass p-6 rounded-[2.5rem] space-y-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <TrendingUp className="text-emerald-400 w-5 h-5" />
              Community
            </h2>
            <nav className="space-y-2">
              {[
                { id: 'all', label: 'All Feed', icon: MessageSquare },
                { id: 'trending', label: 'Trending', icon: Award },
                { id: 'islands', label: 'Island News', icon: Map },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Live Sessions
            </h3>
            <div className="space-y-3">
              {[
                { name: 'StThomasSmoker', island: 'St. Thomas', activity: 'Just sparked up' },
                { name: 'CruzBayQueen', island: 'St. John', activity: 'Reviewing VI Gold' },
              ].map((session, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold">
                      {session.name[0]}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate group-hover:text-emerald-400 transition-colors">{session.name}</p>
                    <p className="text-[9px] text-white/40 truncate">{session.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-[2.5rem] space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['#StThomasHigh', '#IslandKush', '#USVIGrown', '#BeachVibes', '#TerpTalk'].map(tag => (
                <button key={tag} className="text-[10px] font-bold px-3 py-1.5 glass rounded-full hover:bg-emerald-500/20 hover:text-emerald-400 transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-8">
          <header className="lg:hidden">
            <h1 className="text-3xl font-black">Community Feed</h1>
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'trending', 'islands'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-all ${
                    activeTab === tab ? 'bg-emerald-500 text-white' : 'glass text-white/40'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>

          {/* Create Post */}
          {auth.currentUser ? (
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border border-white/5">
              <div className="flex gap-4">
                <button 
                  onClick={handleSmokeSignal}
                  className="flex-1 glass border-emerald-500/30 hover:bg-emerald-500/10 transition-all p-4 rounded-2xl flex items-center justify-center gap-3 group"
                >
                  <Flame className="w-5 h-5 text-orange-500 group-hover:animate-bounce" />
                  <span className="text-sm font-bold uppercase tracking-widest">Send Smoke Signal</span>
                </button>
                <button className="flex-1 glass border-blue-500/30 hover:bg-blue-500/10 transition-all p-4 rounded-2xl flex items-center justify-center gap-3 group">
                  <Wind className="w-5 h-5 text-blue-400 group-hover:animate-pulse" />
                  <span className="text-sm font-bold uppercase tracking-widest">Share a Vibe</span>
                </button>
              </div>

              <form onSubmit={handlePostSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
                  <img 
                    src={auth.currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser.uid}`} 
                    alt="Profile" 
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Share your USVI experience..."
                    className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder:text-white/20 min-h-[100px]"
                  />
                  
                  {sharedProduct && (
                    <div className="glass p-4 rounded-2xl flex items-center gap-4 border border-emerald-500/20">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5">
                        <img src={sharedProduct.imageURLs[0]} className="w-full h-full object-cover" alt={sharedProduct.name} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Sharing Product</p>
                        <p className="font-bold text-sm">{sharedProduct.name}</p>
                      </div>
                    </div>
                  )}

                  {imagePreview && !sharedProduct && (
                    <div className="relative rounded-2xl overflow-hidden aspect-video glass border border-white/10">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute top-4 right-4 bg-black/60 p-2 rounded-full hover:bg-black/80 transition-all backdrop-blur-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 glass rounded-xl hover:bg-white/10 transition-all text-emerald-400"
                    title="Attach Photo"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || (!newPostText.trim() && !imageFile)}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? 'Posting...' : (
                    <>
                      <span>Post</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
            <div className="glass p-12 rounded-[3rem] text-center space-y-6 border border-white/5">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto">
                <UserIcon className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Join the Conversation</h3>
                <p className="text-white/40 max-w-xs mx-auto">Sign in to share your island experiences and connect with locals.</p>
              </div>
              <Link 
                to="/profile"
                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
              >
                Sign In to Post
              </Link>
            </div>
          )}

          {/* Feed */}
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass h-80 rounded-[3rem] animate-pulse" />
              ))
            ) : (
              <AnimatePresence mode='popLayout'>
                {posts.map((post) => {
                  const isLiked = auth.currentUser ? post.likedBy?.includes(auth.currentUser.uid) : false;
                  return (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass p-8 rounded-[3rem] space-y-6 border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                            {post.userPhoto ? (
                              <img src={post.userPhoto} alt={post.userName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-white/20" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold">{post.userName}</p>
                              {post.likesCount > 20 && (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                  <Award className="w-3 h-3 text-emerald-400" />
                                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Connoisseur</span>
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                              {post.createdAt ? formatDistanceToNow(post.createdAt) + ' ago' : 'Just now'}
                            </p>
                          </div>
                        </div>
                        <button className="text-white/20 hover:text-white transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap">{post.text}</p>

                      {post.imageURLs && post.imageURLs.length > 0 && (
                        <div className="rounded-[2rem] overflow-hidden glass aspect-video border border-white/10">
                          <img src={post.imageURLs[0]} className="w-full h-full object-cover" alt="Post content" />
                        </div>
                      )}

                      <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                        <button 
                          onClick={() => handleLike(post.id, isLiked)}
                          className={`flex items-center gap-2 transition-all group/like ${
                            isLiked ? 'text-pink-500' : 'text-white/40 hover:text-pink-500'
                          }`}
                        >
                          <div className={`p-2 rounded-xl transition-all ${isLiked ? 'bg-pink-500/10' : 'bg-white/5 group-hover/like:bg-pink-500/10'}`}>
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-500' : 'group-hover/like:fill-pink-500'}`} />
                          </div>
                          <span className="text-sm font-bold">{post.likesCount || 0}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-all group/comment">
                          <div className="p-2 rounded-xl bg-white/5 group-hover/comment:bg-emerald-500/10 transition-all">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold">0</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            
            {!loading && posts.length === 0 && (
              <div className="text-center py-20 glass rounded-[3rem] border border-dashed border-white/10">
                <p className="text-white/40 italic">The feed is quiet... be the first to post!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Suggestions & News */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Hash className="text-emerald-400 w-5 h-5" />
              Island Buzz
            </h3>
            <div className="space-y-4">
              {[
                { title: 'New Dispensary in St. John', time: '2h ago', tag: 'News' },
                { title: 'Best Sunset Spots for 420', time: '5h ago', tag: 'Guide' },
                { title: 'Local Strain Review: VI Gold', time: '1d ago', tag: 'Review' },
              ].map((item, i) => (
                <div key={i} className="space-y-1 group cursor-pointer">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{item.tag}</p>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition-colors">{item.title}</p>
                  <p className="text-[10px] text-white/20">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20">
            <h3 className="font-bold mb-2">Community Guidelines</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Keep it local, keep it legal. Share your experiences responsibly and respect our island community.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Social;
