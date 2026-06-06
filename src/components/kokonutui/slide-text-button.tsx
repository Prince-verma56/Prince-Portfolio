"use client";

/**
 * @author: @kokonut-labs
 * @description: Slide Text Button with animated vertical text transition
 * @version: 1.0.0
 * @date: 2025-11-02
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SlideTextButtonProps extends Omit<React.HTMLAttributes<HTMLElement>, "onClick"> {
  text?: string;
  hoverText?: string;
  href?: string;
  className?: string;
  variant?: "default" | "ghost" | "custom";
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  disabled?: boolean;
  animateEntrance?: boolean;
}

export default function SlideTextButton({
  text = "Browse Components",
  hoverText,
  href,
  className,
  variant = "default",
  type = "button",
  onClick,
  disabled,
  animateEntrance = true,
  ...props
}: SlideTextButtonProps) {
  const slideText = hoverText ?? text;
  const variantStyles =
    variant === "ghost"
      ? "border border-black/10 text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
      : variant === "custom"
      ? ""
      : "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90";

  const buttonClasses = cn(
    "group relative inline-flex items-center justify-center overflow-hidden transition-all duration-300",
    variant === "custom"
      ? ""
      : "h-10 rounded-lg px-8 font-medium text-md tracking-tighter md:min-w-56",
    variantStyles,
    className
  );

  const innerContent = (
    <span className="relative inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
      <span className="flex items-center gap-2 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
        <span className={variant === "custom" ? "" : "font-medium"}>{text}</span>
      </span>
      <span className="absolute top-full left-0 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className={variant === "custom" ? "" : "font-medium"}>{slideText}</span>
      </span>
    </span>
  );

  const buttonElement = href ? (
    <Link
      className={buttonClasses}
      href={href}
      onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      {...(props as any)}
    >
      {innerContent}
    </Link>
  ) : (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      {...(props as any)}
    >
      {innerContent}
    </button>
  );

  if (animateEntrance) {
    return (
      <motion.div
        animate={{ x: 0, opacity: 1, transition: { duration: 0.2 } }}
        className="relative w-fit"
        initial={{ x: 200, opacity: 0 }}
      >
        {buttonElement}
      </motion.div>
    );
  }

  return <div className="relative w-fit">{buttonElement}</div>;
}
