"use client";

import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Heart, PartyPopper, X } from "lucide-react";
import { useEffect, useState } from "react";

export function BirthdaySurprise() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGift, setShowGift] = useState(false);

  useEffect(() => {
    // Show the gift after a short delay
    const timer = setTimeout(() => setShowGift(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleOpen = () => {
    setIsOpen(true);
    triggerConfetti();
  };

  return (
    <>
      <AnimatePresence>
        {showGift && !isOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <Button
              onClick={handleOpen}
              size="lg"
              className="h-16 w-16 rounded-full bg-accent hover:bg-accent/90 shadow-2xl border-4 border-white dark:border-slate-900 group"
            >
              <Gift className="h-8 w-8 text-white animate-bounce group-hover:scale-125 transition-transform" />
            </Button>
            <span className="absolute -top-12 right-0 bg-white dark:bg-slate-800 text-xs font-bold py-1 px-3 rounded-full shadow-lg border border-primary/20 whitespace-nowrap animate-pulse">
              Kaptan'a Sürpriz! 🎁
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="relative w-full max-w-lg bg-card border-2 border-primary/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(234,88,12,0.3)]"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="p-8 text-center space-y-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <PartyPopper className="h-20 w-20 text-primary mx-auto" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-4xl font-bold font-[family-name:var(--font-display)] italic text-primary">
                    İyi ki Doğdun <br /> Cem Kaptan!
                  </h2>
                  <p className="text-xl text-muted-foreground font-medium">
                    Discobolos ailesi seninle gurur duyuyor.
                  </p>
                </div>

                <div className="py-6 px-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-lg leading-relaxed italic text-foreground/90">
                    "Sahadaki liderliğin, bitmek bilmeyen enerjin ve Spirit of the Game ruhunla hepimize ilham veriyorsun. Yeni yaşında bol süratli asistler, muazzam bloklar ve her zaman adil bir oyun seni beklesin!"
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <Heart className="text-red-500 fill-red-500 h-6 w-6 animate-ping" />
                  <span className="font-bold text-primary">Halikarnassos Discobolos Team</span>
                </div>

                <Button 
                  onClick={() => triggerConfetti()} 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Daha Fazla Konfeti! 🎉
                </Button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full -translate-x-12 -translate-y-12 blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 rounded-full translate-x-16 translate-y-16 blur-3xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
