"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface MotionProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

interface MotionButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function FadeIn({ children, className, delay = 0, ...props }: MotionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function SlideUp({ children, className, delay = 0, ...props }: MotionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function StaggerContainer({ children, className, delay = 0, ...props }: MotionProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function ScaleOnHover({ children, className, ...props }: MotionProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function ScaleOnHoverButton({ children, className, ...props }: MotionButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
}
