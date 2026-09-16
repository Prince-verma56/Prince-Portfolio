"use client";

import React, { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
    className?: string;
    children: string;
    duration?: number;
    delay?: number;
    separator?: string;
    together?: boolean;
}

/**
 * Per-character 3D flip-in when the text scrolls into view, and a full spin on hover.
 *
 * Implemented with CSS animations (see `.flip-char` in globals.css) instead of one
 * motion.span per character with `preserve-3d`. That version left every character
 * holding a 3D transform at rest, which promoted each one to its own compositor
 * layer: ~235 of the ~300 layers on the page came from these headings and made the
 * per-frame layer-tree update the largest main-thread cost while scrolling. CSS
 * keyframes composite the characters only while they animate and return them to
 * `transform: none` afterwards, so they hold zero layers at rest.
 */
export function FlipText({
    className,
    children,
    duration = 1.2,
    delay = 0.1,
    separator = " ",
    together = false,
}: FlipTextProps) {
    const words = useMemo(() => children.split(separator), [children, separator]);
    const rootRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    // Same trigger as the old whileInView: once, when within 10% of the viewport.
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "-10% 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={rootRef}
            className={cn("flip-text-wrapper inline-block leading-none", inView && "is-inview", className)}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="word inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => {
                        const entranceDelay = delay + (together ? 0 : charIndex * 0.03 + wordIndex * 0.1);
                        const hoverDelay = together ? 0 : charIndex * 0.03;
                        return (
                            <span
                                key={charIndex}
                                className="flip-char inline-block"
                                style={{
                                    "--flip-duration": `${duration}s`,
                                    "--flip-delay": `${entranceDelay}s`,
                                    "--flip-hover-delay": `${hoverDelay}s`,
                                } as CSSProperties}
                            >
                                {char}
                            </span>
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
        </div>
    );
}

export default FlipText;
