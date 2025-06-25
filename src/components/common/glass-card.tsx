"use client";

import type React from "react";

import { motion } from "framer-motion";
import { memo, useRef, useState } from "react";

interface GlassCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  variant?: "blue" | "purple";
  children?: React.ReactNode;
}

export const GlassCard = memo(
  ({
    icon,
    title,
    description,
    index,
    variant = "blue",
    children,
  }: GlassCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setRotation({
          x: -(y / rect.height) * 3,
          y: (x / rect.width) * 3,
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setRotation({ x: 0, y: 0 });
    };

    const bgGradient =
      variant === "purple"
        ? "from-purple-500/20 to-pink-500/20"
        : "from-blue-500/20 to-purple-500/20";
    const bottomGlow =
      variant === "purple"
        ? `radial-gradient(ellipse at bottom right, rgba(147, 51, 234, 0.15) -10%, transparent 60%),
           radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.15) -10%, transparent 60%)`
        : `radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.15) -10%, transparent 60%),
           radial-gradient(ellipse at bottom left, rgba(147, 51, 234, 0.15) -10%, transparent 60%)`;
    const centerGlow =
      variant === "purple"
        ? `radial-gradient(circle at bottom center, rgba(168, 85, 247, 0.2) -20%, transparent 50%)`
        : `radial-gradient(circle at bottom center, rgba(99, 102, 241, 0.2) -20%, transparent 50%)`;

    return (
      <motion.div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden h-full bg-white/5 dark:bg-white/5 border border-gray-300/40 dark:border-white/10 cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          minHeight: "280px",
          perspective: 1000,
          borderRadius: "16px",
        }}
        initial={{ y: 0 }}
        animate={{
          y: isHovered ? -5 : 0,
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Нижнее свечение */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2/3 z-20 rounded-2xl"
          style={{ background: bottomGlow, filter: "blur(25px)" }}
          animate={{ opacity: isHovered ? 0.6 : 0.4 }}
        />

        {/* Центральное свечение */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 z-21 rounded-2xl"
          style={{ background: centerGlow, filter: "blur(20px)" }}
          animate={{ opacity: isHovered ? 0.5 : 0.3 }}
        />

        {/* Контент */}
        <motion.div className="relative flex flex-col h-full p-6 z-40">
          <motion.div
            className="flex justify-center items-center mb-6"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotateX: isHovered ? -rotation.x * 0.5 : 0,
              rotateY: isHovered ? -rotation.y * 0.5 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className={`p-4 rounded-full bg-gradient-to-br ${bgGradient} backdrop-blur-sm border flex items-center justify-center w-16 h-16 ${
                variant === "purple"
                  ? "border-purple-500/30"
                  : "border-blue-500/30"
              }`}
            >
              {icon}
            </div>
          </motion.div>

          <div className="flex flex-col flex-1 text-center">
            <motion.h4
              className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
              animate={{
                textShadow: isHovered
                  ? "0 2px 4px rgba(0,0,0,0.2)"
                  : "0px 0px 0px rgba(0,0,0,0)",
              }}
            >
              {title}
            </motion.h4>
            <motion.p
              className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1 flex items-center justify-center"
              animate={{
                textShadow: isHovered
                  ? "0 1px 2px rgba(0,0,0,0.1)"
                  : "0px 0px 0px rgba(0,0,0,0)",
              }}
            >
              {description}
            </motion.p>
          </div>
        </motion.div>

        {/* Тень */}
        <motion.div
          className="absolute inset-0 rounded-2xl z-30 pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 16px -8px rgba(0, 0, 0, 0.2)"
              : "0 10px 20px -6px rgba(0, 0, 0, 0.05), 0 4px 8px -4px rgba(0, 0, 0, 0.08)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
