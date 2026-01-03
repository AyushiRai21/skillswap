import React, { useRef, useEffect, useState } from 'react';

export default function Reveal({ children, className = '', rootMargin = '0px 0px -10% 0px', threshold = 0.08 }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(node);
        }
      });
    }, { root: null, rootMargin, threshold });
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref, rootMargin, threshold]);

  return (
    <div ref={ref} className={`${className} transition-all duration-700 ease-out transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {children}
    </div>
  );
}
