"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FlipTextProps {
    className?: string;
    children: string;
    duration?: number;
    delay?: number;
    separator?: string;
    together?: boolean;
}

export function FlipText({
    className,
    children,
    duration = 1.2,
    delay = 0.1,
    separator = " ",
    together = false,
}: FlipTextProps) {
    const words = useMemo(() => children.split(separator), [children, separator]);
    const [flipCount, setFlipCount] = useState(0);

    return (
        <motion.div
            className={cn("flip-text-wrapper inline-block leading-none", className)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-10%" }}
            onMouseEnter={() => setFlipCount(c => c + 1)}
            style={{ perspective: "1000px" }}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="word inline-block whitespace-nowrap" style={{ transformStyle: "preserve-3d" }}>
                    {word.split("").map((char, charIndex) => {
                        const calculatedDelay = together ? 0 : (charIndex * 0.03) + (wordIndex * 0.1);
                        return (
                            <motion.span
                                key={charIndex}
                                className="inline-block relative"
                                style={{ transformStyle: "preserve-3d", transformOrigin: "50% 50%" }}
                                custom={flipCount}
                                variants={{
                                    initial: { rotateX: 90, opacity: 0 },
                                    animate: (currentCount) => ({
                                        rotateX: currentCount * 360,
                                        opacity: 1,
                                        transition: {
                                            duration: duration,
                                            ease: currentCount > 0 ? "easeInOut" : "easeOut",
                                            delay: currentCount > 0 
                                                ? (together ? 0 : (charIndex * 0.03)) 
                                                : (delay + calculatedDelay)
                                        }
                                    })
                                }}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                    {separator === " " && wordIndex < words.length - 1 && (
                        <span className="whitespace inline-block">&nbsp;</span>
                    )}
                    {separator !== " " && wordIndex < words.length - 1 && (
                        <span className="separator inline-block">{separator}</span>
                    )}
                </span>
            ))}
        </motion.div>
    );
}

export default FlipText;
