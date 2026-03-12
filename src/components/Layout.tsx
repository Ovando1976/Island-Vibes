import React from 'react';
import { Navbar } from './Navbar';
import { BudGuide } from './BudGuide';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pt-20">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-8"
      >
        {children}
      </motion.main>
      <BudGuide />
    </div>
  );
};
