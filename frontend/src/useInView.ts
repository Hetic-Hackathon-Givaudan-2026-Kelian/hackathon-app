import { useEffect, useRef, useState } from "react";

/** Passe à true quand l'élément entre à l'écran (une seule fois). */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  // Sans IntersectionObserver (très vieux navigateur), on affiche tout de suite.
  const [visible, setVisible] = useState(
    () => !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible] as const;
}
