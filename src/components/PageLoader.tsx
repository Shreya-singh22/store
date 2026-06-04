"use client";
import { useState, useEffect } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Reduced time for a faster feel
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        .loader-overlay {
          position: fixed;
          inset: 0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.2s ease;
        }
        .loader-dots {
          display: flex;
          gap: 8px;
        }
        .loader-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: dot-bounce 0.6s ease-in-out infinite alternate;
        }
        .loader-dots span:nth-child(1) { background: #800000; } /* Maroon */
        .loader-dots span:nth-child(2) { background: #D4AF37; animation-delay: 0.2s; } /* Gold */
        .loader-dots span:nth-child(3) { background: #800000; animation-delay: 0.4s; } /* Maroon */
        @keyframes dot-bounce {
          from { transform: translateY(0); opacity: 0.4; }
          to   { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
      <div className="loader-overlay">
        <div className="loader-dots">
          <span /><span /><span />
        </div>
      </div>
    </>
  );
}
