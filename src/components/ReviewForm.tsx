import React, { useState, useRef } from 'react';
import { Star, Camera, X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import { motion } from 'motion/react';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const newFiles = [...imageFiles, ...files].slice(0, 4); // Limit to 4 images
      setImageFiles(newFiles);
      
      const newPreviews: string[] = [];
      let loadedCount = 0;
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 4));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be signed in to leave a review.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const storageRef = ref(storage, `reviews/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          imageUrls.push(url);
        }
      }

      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || '',
        rating,
        title,
        body,
        imageURLs: imageUrls,
        createdAt: Date.now(),
      });
      
      setTitle('');
      setBody('');
      setRating(5);
      setImageFiles([]);
      setImagePreviews([]);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error adding review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-8 rounded-[2rem] space-y-6">
      <h3 className="text-xl font-bold">Write a Review</h3>
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-white/40">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform active:scale-90"
            >
              <Star
                className={`w-8 h-8 ${
                  (hover || rating) >= star ? 'text-brand-gold fill-brand-gold' : 'text-white/10'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-white/40">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-white/40">Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you like or dislike about this product?"
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-white/40">Photos (Max 4)</label>
        <div className="flex flex-wrap gap-4">
          {imagePreviews.length < 4 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 glass rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <Camera className="w-6 h-6 text-white/40" />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-emerald-500/50">
              <img src={preview} className="w-full h-full object-cover" alt={`Preview ${index}`} />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-black/60 p-1 rounded-bl-lg"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all active:scale-95"
      >
        {isSubmitting ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};
