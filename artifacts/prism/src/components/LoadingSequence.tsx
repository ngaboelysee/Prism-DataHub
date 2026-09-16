import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Splitting perspectives...",
  "Activating Contrarian...",
  "Expanding possibilities...",
  "Structuring execution plan...",
  "Synthesizing verdict..."
];

export function LoadingSequence() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F4F0] text-[#111]">
      <div className="relative flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-20 h-20 border-t-2 border-r-2 border-black/20 rounded-full mb-8"
        />
        <div className="h-8 relative overflow-hidden flex items-center justify-center w-64">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-light tracking-wide text-black/60 absolute text-center w-full"
            >
              {messages[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
