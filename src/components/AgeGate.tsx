import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface AgeGateProps {
  onConfirm: () => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified');
    if (!isVerified) {
      setIsVisible(true);
    } else {
      onConfirm();
    }
  }, [onConfirm]);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-6"
        >
          <div className="max-w-md w-full glass p-8 rounded-[2rem] text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Island Vibes</h1>
            <p className="text-white/60 mb-8">
              You must be 21 years of age or older to enter this site. By clicking "I am 21+", you confirm that you are of legal age.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleVerify}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95"
              >
                I am 21+
              </button>
              <button
                onClick={() => window.location.href = 'https://google.com'}
                className="w-full bg-white/5 hover:bg-white/10 text-white/60 py-4 rounded-2xl transition-all"
              >
                Exit
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
