"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

type FloatingGhostProps = {
  size?: number;
  className?: string;
};

export default function FloatingGhost({
  size = 140,
  className = "",
}: FloatingGhostProps) {
  const [pos, setPos] = useState({ x: 82, y: 30 });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [mouseDist, setMouseDist] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [expression, setExpression] = useState<"normal" | "surprised" | "happy">("normal");

  const randomPos = useCallback(() => {
    const side = Math.random() > 0.5;
    return {
      x: side ? 80 + Math.random() * 12 : 2 + Math.random() * 12,
      y: 8 + Math.random() * 30,
    };
  }, []);

  // Drift to new position every ~10s
  useEffect(() => {
    const interval = setInterval(() => setPos(randomPos()), 10000);
    return () => clearInterval(interval);
  }, [randomPos]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
      // Distance from ghost center (approximate)
      const ghostCenterX = (pos.x / 100) * window.innerWidth + size / 2;
      const ghostCenterY = (pos.y / 100) * window.innerHeight + size / 2;
      const dist = Math.hypot(e.clientX - ghostCenterX, e.clientY - ghostCenterY);
      setMouseDist(dist);
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("scroll", onScroll); };
  }, [pos, size]);

  const onHover = () => {
    setExpression("surprised");
    setTimeout(() => setExpression("happy"), 400);
    setTimeout(() => setExpression("normal"), 2200);
  };

  const [clicked, setClicked] = useState(0);
  const onClick = () => {
    const r = Math.ceil(Math.random() * 4);
    setClicked(r);
    setExpression(r <= 2 ? "surprised" : "happy");
    setTimeout(() => { setClicked(0); setExpression("normal"); }, 1200);
  };

  const eyeX = mouse.x * 8;
  const eyeY = mouse.y * 5;
  const farAway = mouseDist > 400;
  const eyeScale = farAway ? 1.4 : 1;

  const clickAnims: Record<number, { y?: number[]; rotate?: number[]; scale?: number[]; x?: number[] }> = {
    1: { y: [0, -30, 0], rotate: [0, 360], scale: [1, 1.15, 1] },
    2: { y: [0, -12, 0, -8, 0], scale: [1, 0.8, 1.1, 0.95, 1] },
    3: { x: [0, -15, 15, -8, 8, 0], rotate: [0, -8, 8, -4, 4, 0] },
    4: { y: [0, -35, -30, 0], scale: [1, 0.9, 1.12, 1] },
  };

  return (
    <motion.div
      className={`fixed z-30 hidden lg:block ${className}`}
      style={{ width: size, height: size, marginTop: -scrollY * 0.15 }}
      animate={{ left: `${pos.x}%`, top: `${pos.y}%`, rotate: [0, 2, -1.5, 1, 0] }}
      transition={{
        left: { duration: 8, ease: [0.25, 0.1, 0.25, 1] },
        top: { duration: 8, ease: [0.25, 0.1, 0.25, 1] },
        rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" },
      }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-auto cursor-pointer select-none"
        style={{ width: size, height: size, filter: "drop-shadow(0 10px 25px rgba(88,101,242,0.12))", opacity: 0.85 }}
        animate={clicked ? clickAnims[clicked] : { y: [0, -8, 2, -5, 0], x: [0, 2, -1, 1, 0] }}
        transition={clicked ? { duration: 0.5, ease: "easeOut" } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none">
          {/* wings */}
          <motion.path d="M130 168C96 160 74 132 78 96C93 122 113 134 143 135C140 148 136 159 130 168Z" fill="white"
            animate={{ rotate: [0, -6, 5, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "130px 168px" }} />
          <motion.path d="M111 154C84 146 66 124 68 101C83 122 101 130 126 130C123 140 118 149 111 154Z" fill="white"
            animate={{ rotate: [0, -7, 4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "111px 154px" }} />
          <motion.path d="M382 168C416 160 438 132 434 96C419 122 399 134 369 135C372 148 376 159 382 168Z" fill="white"
            animate={{ rotate: [0, 6, -5, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "382px 168px" }} />
          <motion.path d="M401 154C428 146 446 124 444 101C429 122 411 130 386 130C389 140 394 149 401 154Z" fill="white"
            animate={{ rotate: [0, 7, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "401px 154px" }} />

          {/* headphones */}
          <path d="M128 180C134 87 378 87 384 180" stroke="white" strokeWidth="16" strokeLinecap="round" />
          <path d="M146 178C154 105 358 105 366 178" stroke="black" strokeWidth="8" strokeLinecap="round" />
          <path d="M103 183C89 183 80 202 80 231C80 260 89 278 103 278C119 278 126 258 126 231C126 204 119 183 103 183Z" fill="white" />
          <path d="M126 191C138 198 143 211 143 231C143 251 138 264 126 271" stroke="white" strokeWidth="10" strokeLinecap="round" />
          <path d="M409 183C423 183 432 202 432 231C432 260 423 278 409 278C393 278 386 258 386 231C386 204 393 183 409 183Z" fill="white" />
          <path d="M386 191C374 198 369 211 369 231C369 251 374 264 386 271" stroke="white" strokeWidth="10" strokeLinecap="round" />

          {/* head */}
          <path d="M120 202C120 130 174 92 256 92C338 92 392 130 392 202V238C392 294 344 326 256 326C168 326 120 294 120 238V202Z" fill="white" />
          <path d="M185 116C207 143 225 168 256 168C287 168 305 143 327 116C304 102 208 102 185 116Z" fill="white" />
          <path d="M185 116C208 141 224 166 256 168" stroke="black" strokeWidth="6" strokeLinecap="round" />
          <path d="M327 116C304 141 288 166 256 168" stroke="black" strokeWidth="6" strokeLinecap="round" />

          {/* face */}
          <path d="M153 206C153 171 178 154 256 154C334 154 359 171 359 206V226C359 265 323 280 256 280C189 280 153 265 153 226V206Z" fill="black" />

          {/* eyes */}
          <g transform={`translate(${eyeX}, ${eyeY}) scale(${eyeScale})`} style={{ transformOrigin: "256px 220px" }}>
            {expression === "surprised" ? (
              <><circle cx="225" cy="218" r="15" fill="white" /><circle cx="287" cy="218" r="15" fill="white" /><circle cx="225" cy="218" r="5" fill="black" /><circle cx="287" cy="218" r="5" fill="black" /></>
            ) : expression === "happy" ? (
              <><path d="M205 225C216 210 236 210 246 225" stroke="white" strokeWidth="16" strokeLinecap="round" /><path d="M267 225C278 210 298 210 309 225" stroke="white" strokeWidth="16" strokeLinecap="round" /></>
            ) : farAway ? (
              <><circle cx="225" cy="218" r="13" fill="white" /><circle cx="287" cy="218" r="13" fill="white" /><circle cx={225 + eyeX * 0.3} cy={218 + eyeY * 0.3} r="5" fill="black" /><circle cx={287 + eyeX * 0.3} cy={218 + eyeY * 0.3} r="5" fill="black" /></>
            ) : (
              <><path d="M205 221C216 205 236 206 246 224" stroke="white" strokeWidth="16" strokeLinecap="round" /><path d="M267 224C278 206 298 205 309 221" stroke="white" strokeWidth="16" strokeLinecap="round" /></>
            )}
          </g>

          {/* neck + body */}
          <path d="M130 291C163 315 205 326 256 326C307 326 349 315 382 291" stroke="black" strokeWidth="6" strokeLinecap="round" />
          <path d="M162 319C154 353 167 402 196 423C216 438 236 441 256 441C276 441 296 438 316 423C345 402 358 353 350 319C326 335 292 344 256 344C220 344 186 335 162 319Z" fill="white" />
          <path d="M162 319L209 368" stroke="black" strokeWidth="7" strokeLinecap="round" />
          <path d="M350 319L303 368" stroke="black" strokeWidth="7" strokeLinecap="round" />
          <path d="M209 368C220 361 237 358 256 358C275 358 292 361 303 368" stroke="black" strokeWidth="7" strokeLinecap="round" />
          <path d="M209 368C207 402 225 430 256 441C287 430 305 402 303 368" stroke="black" strokeWidth="7" strokeLinecap="round" />
          <path d="M181 406L162 374" stroke="black" strokeWidth="7" strokeLinecap="round" />
          <path d="M331 374L312 406" stroke="black" strokeWidth="7" strokeLinecap="round" />

          {/* tail */}
          <motion.path d="M222 438C229 471 242 490 256 490C270 490 283 471 290 438C279 442 268 444 256 444C244 444 233 442 222 438Z" fill="white"
            animate={{ d: ["M222 438C229 471 242 490 256 490C270 490 283 471 290 438C279 442 268 444 256 444C244 444 233 442 222 438Z", "M225 437C232 465 244 481 256 481C268 481 280 465 287 437C277 440 267 442 256 442C245 442 235 440 225 437Z", "M222 438C229 471 242 490 256 490C270 490 283 471 290 438C279 442 268 444 256 444C244 444 233 442 222 438Z"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        </svg>
      </motion.div>
    </motion.div>
  );
}
