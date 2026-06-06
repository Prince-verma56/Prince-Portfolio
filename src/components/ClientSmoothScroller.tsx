"use client";
import dynamic from "next/dynamic";

const SmoothScroller = dynamic(() => import("./SmoothScroller"), {
  ssr: false,
});

export default function ClientSmoothScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SmoothScroller>{children}</SmoothScroller>;
}
