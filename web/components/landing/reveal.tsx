"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  group?: boolean;
}

export function Reveal({ children, className = "", group = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top > window.innerHeight) setRevealed(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setRevealed(true);
      else setRevealed(false);
    }, { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal-target ${group ? "reveal-group" : ""} ${className}`} data-reveal={revealed ? "shown" : "pending"}>{children}</div>;
}
