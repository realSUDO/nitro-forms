"use client";

import { motion } from "framer-motion";

type FloatingGhostProps = {
  size?: number;
  mood?: "smile" | "smirk" | "happy";
  className?: string;
};

export default function FloatingGhost({
  size = 150,
  mood = "smirk",
  className = "",
}: FloatingGhostProps) {
  const isSmirk = mood === "smirk";

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: "drop-shadow(0 18px 35px rgba(88,101,242,0.18))",
      }}
      animate={{
        x: [0, 14, -10, 8, 0],
        y: [0, -20, -8, 12, 0],
        rotate: [0, -4, 3, -2, 0],
        scale: [1, 1.025, 1, 0.99, 1],
      }}
      transition={{
        duration: 9.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 260 300" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none">
        <motion.ellipse cx="130" cy="275" rx="48" ry="10" fill="#5865f2" opacity="0.22"
          animate={{ rx: [42, 58, 42], opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path d="M62 88C44 84 35 69 35 51C47 67 58 70 72 70C70 78 67 84 62 88Z" fill="white"
          animate={{ rotate: [0, -5, 4, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "62px 88px" }}
        />
        <motion.path d="M198 88C216 84 225 69 225 51C213 67 202 70 188 70C190 78 193 84 198 88Z" fill="white"
          animate={{ rotate: [0, 5, -4, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "198px 88px" }}
        />
        <motion.path d="M52 130C52 54 208 54 208 130" stroke="white" strokeWidth="13" strokeLinecap="round"
          animate={{ d: ["M52 130C52 54 208 54 208 130", "M50 129C52 48 208 48 210 129", "M52 130C52 54 208 54 208 130"] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect x="35" y="116" width="31" height="61" rx="17" fill="white"
          animate={{ y: [116, 113, 116] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect x="194" y="116" width="31" height="61" rx="17" fill="white"
          animate={{ y: [116, 113, 116] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.12 }}
        />
        <motion.path
          d="M58 127C58 76 88 45 130 45C172 45 202 76 202 127V178C202 224 173 252 130 252C87 252 58 224 58 178V127Z"
          fill="white"
          animate={{ d: [
            "M58 127C58 76 88 45 130 45C172 45 202 76 202 127V178C202 224 173 252 130 252C87 252 58 224 58 178V127Z",
            "M56 130C56 78 87 48 130 48C173 48 204 78 204 130V176C204 224 172 249 130 249C88 249 56 224 56 176V130Z",
            "M58 127C58 76 88 45 130 45C172 45 202 76 202 127V178C202 224 173 252 130 252C87 252 58 224 58 178V127Z",
          ] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <path d="M91 68C107 84 115 101 130 101C145 101 153 84 169 68C153 59 107 59 91 68Z" fill="white" />
        <motion.rect x="68" y="102" width="124" height="74" rx="37" fill="black"
          animate={{ y: [102, 99, 102], scaleX: [1, 1.015, 1] }}
          transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "130px 139px" }}
        />
        <motion.path
          d={isSmirk ? "M96 137C105 126 119 128 127 140" : "M95 139C104 126 119 126 128 139"}
          stroke="white" strokeWidth="11" strokeLinecap="round"
          animate={{
            d: isSmirk
              ? ["M96 137C105 126 119 128 127 140", "M96 136C106 128 119 129 127 139", "M96 137C105 126 119 128 127 140"]
              : ["M95 139C104 126 119 126 128 139", "M96 137C105 128 118 128 127 137", "M95 139C104 126 119 126 128 139"],
            opacity: [1, 1, 0.25, 1],
          }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d={isSmirk ? "M158 140C167 130 181 128 189 136" : "M157 139C166 126 181 126 190 139"}
          stroke="white" strokeWidth="11" strokeLinecap="round"
          animate={{
            d: isSmirk
              ? ["M158 140C167 130 181 128 189 136", "M158 139C168 131 181 130 189 136", "M158 140C167 130 181 128 189 136"]
              : ["M157 139C166 126 181 126 190 139", "M158 137C167 128 180 128 189 137", "M157 139C166 126 181 126 190 139"],
            opacity: [1, 1, 0.25, 1],
          }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
        <path d="M83 185C101 205 113 216 130 216C147 216 159 205 177 185" stroke="black" strokeWidth="7" strokeLinecap="round" />
        <path d="M103 204C101 231 114 247 130 253C146 247 159 231 157 204" stroke="black" strokeWidth="7" strokeLinecap="round" />
        <path d="M103 204L78 175" stroke="black" strokeWidth="7" strokeLinecap="round" />
        <path d="M157 204L182 175" stroke="black" strokeWidth="7" strokeLinecap="round" />
        <motion.path d="M109 250C113 273 121 286 130 286C139 286 147 273 151 250" fill="white"
          animate={{ d: ["M109 250C113 273 121 286 130 286C139 286 147 273 151 250", "M112 249C116 268 123 279 130 279C137 279 144 268 148 249", "M109 250C113 273 121 286 130 286C139 286 147 273 151 250"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path d="M213 236L219 250L234 256L219 262L213 276L207 262L192 256L207 250L213 236Z" fill="white" opacity="0.75"
          animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.28, 0.85, 0.28], rotate: [0, 20, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "213px 256px" }}
        />
        <motion.circle cx="47" cy="230" r="4" fill="#5865f2" opacity="0.55"
          animate={{ scale: [1, 1.7, 1], opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </svg>
    </motion.div>
  );
}
