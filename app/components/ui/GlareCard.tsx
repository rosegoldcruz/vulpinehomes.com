"use client";

import { useRef, useState } from "react";

export const GlareCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    glare: {
      x: 50,
      y: 50,
    },
    background: {
      x: 50,
      y: 50,
    },
    rotate: {
      x: 0,
      y: 0,
    },
  });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rotateFactor = 0.4;
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const percentage = {
      x: (100 / rect.width) * position.x,
      y: (100 / rect.height) * position.y,
    };
    const delta = {
      x: percentage.x - 50,
      y: percentage.y - 50,
    };

    const { background, rotate, glare } = state;
    background.x = 50 + percentage.x / 4 - 12.5;
    background.y = 50 + percentage.y / 3 - 16.67;
    rotate.x = -(delta.x / 3.5);
    rotate.y = delta.y / 2;
    rotate.x *= rotateFactor;
    rotate.y *= rotateFactor;
    glare.x = percentage.x;
    glare.y = percentage.y;

    setState({
      ...state,
      background,
      rotate,
      glare,
    });
  };

  const handlePointerEnter = () => {
    isPointerInside.current = true;
    setTimeout(() => {
      if (isPointerInside.current) {
        if (refElement.current) {
          refElement.current.style.removeProperty("transition");
        }
      }
    }, 300);
  };

  const handlePointerLeave = () => {
    isPointerInside.current = false;
    if (refElement.current) {
      refElement.current.style.removeProperty("transform");
      refElement.current.style.setProperty("transition", "transform 500ms ease");
    }
    setState({
      ...state,
      rotate: { x: 0, y: 0 },
      glare: { x: 50, y: 50 },
    });
  };

  return (
    <div
      ref={refElement}
      className={`relative isolate [contain:layout_style] [perspective:600px] transition-transform duration-[200ms] ease-out ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="h-full w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0f] [transform-style:preserve-3d]"
        style={{
          transform: `rotateY(${state.rotate.x}deg) rotateX(${state.rotate.y}deg)`,
        }}
      >
        <div className="relative h-full w-full [transform:translateZ(0)]">
          {children}
        </div>
        <div
          className="absolute inset-0 h-full w-full bg-[radial-gradient(farthest-corner_circle_at_var(--glare-x)_var(--glare-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)] opacity-[var(--opacity)] mix-blend-overlay transition-opacity duration-[200ms] ease-out pointer-events-none"
          style={
            {
              "--glare-x": `${state.glare.x}%`,
              "--glare-y": `${state.glare.y}%`,
              "--opacity": isPointerInside.current ? 0.4 : 0,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
};
