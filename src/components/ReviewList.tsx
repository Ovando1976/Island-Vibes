import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Review } from '../types';
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  productId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(revs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="glass p-6 rounded-3xl animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-[2rem]">
        <p className="text-white/40 italic">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="glass p-8 rounded-[2rem] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center overflow-hidden">
                {review.userPhoto ? (
                  <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white/20" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm">{review.userName}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                  {review.createdAt ? formatDistanceToNow(review.createdAt) + ' ago' : 'Just now'}
                </p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    review.rating >= star ? 'text-brand-gold fill-brand-gold' : 'text-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-1">{review.title}</h4>
            <p className="text-sm text-white/70 leading-relaxed mb-4">{review.body}</p>
            
            {review.imageURLs && review.imageURLs.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {review.imageURLs.map((url: string, i: number) => (
                  <div key={i} className="w-24 h-24 rounded-xl overflow-hidden glass flex-shrink-0">
                    <img src={url} className="w-full h-full object-cover" alt={`Review ${i}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
