// components/templates/CoverGate.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoverGateProps {
  groomName: string;
  brideName: string;
  groomInitial: string;
  brideInitial: string;
  onOpen: () => void;
}

export default function CoverGate({ 
  groomName, 
  brideName, 
  groomInitial, 
  brideInitial, 
  onOpen 
}: CoverGateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onOpen, 800);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 overflow-hidden"
          exit={{ opacity: 0 }}
        >
          {/* Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/images/cover-bg.jpg)',
              filter: 'brightness(0.7)'
            }}
          />
          
          {/* Gate Left */}
          <motion.div 
            className="absolute top-0 left-0 w-1/2 h-full bg-white z-10"
            initial={{ x: 0 }}
            animate={{ x: isOpen ? '-100%' : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100" />
          </motion.div>
          
          {/* Gate Right */}
          <motion.div 
            className="absolute top-0 right-0 w-1/2 h-full bg-white z-10"
            initial={{ x: 0 }}
            animate={{ x: isOpen ? '100%' : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-white to-gray-100" />
          </motion.div>
          
          {/* Content */}
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-white text-center px-4">
            <div className="flex items-center justify-center gap-8 mb-6">
              <motion.h2 
                className="text-6xl md:text-8xl font-serif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {groomInitial}
              </motion.h2>
              <motion.span 
                className="text-3xl md:text-5xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                &amp;
              </motion.span>
              <motion.h2 
                className="text-6xl md:text-8xl font-serif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {brideInitial}
              </motion.h2>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <img 
                src="/images/divider.png" 
                alt="divider" 
                className="w-48 mx-auto mb-6 opacity-80"
              />
            </motion.div>
            
            <motion.h1 
              className="text-2xl md:text-3xl font-light mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              The Wedding Of
            </motion.h1>
            
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {groomName} & {brideName}
            </motion.h2>
            
            <motion.button
              onClick={handleOpen}
              className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white rounded-full hover:bg-white/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buka Undangan
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}