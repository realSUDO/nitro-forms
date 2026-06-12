import React from "react";

export function BotSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          @keyframes bot-wave {
            0%, 100% { transform: rotate(0deg); transform-origin: 150px 110px; }
            50% { transform: rotate(30deg); transform-origin: 150px 110px; }
          }
          @keyframes bot-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .bot-arm { animation: bot-wave 1.5s infinite ease-in-out; }
          .bot-leaf { animation: bot-float 3s infinite ease-in-out; }
        `}
      </style>
      
      {/* Background (None, transparent for light mode inversion) */}
      
      <g stroke="#1c1d21" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {/* LEAF */}
        <g className="bot-leaf" fill="#81ce4e">
          <path d="M90,40 Q110,10 130,25 Q115,55 90,40 Z" />
          <path d="M90,40 Q110,30 120,25" fill="none" strokeWidth="4" />
          {/* Bite mark */}
          <path d="M100,18 C105,25 115,25 120,15" fill="#1c1d21" stroke="none" />
        </g>
        
        {/* LEGS */}
        <path d="M85,170 C85,185 95,185 95,170" fill="#7a8ee1" />
        <path d="M115,170 C115,185 105,185 105,170" fill="#7a8ee1" />

        {/* BODY */}
        <ellipse cx="100" cy="140" rx="35" ry="35" fill="#7a8ee1" />

        {/* LEFT ARM (Static) */}
        <path d="M65,130 Q55,150 70,165" fill="none" />
        
        {/* RIGHT ARM (Waving) */}
        <g className="bot-arm">
          <path d="M130,130 Q160,110 150,90 Q140,85 130,100" fill="#7a8ee1" />
        </g>

        {/* EARS */}
        <path d="M30,85 C10,85 10,115 30,115" fill="#7a8ee1" />
        <path d="M25,95 C15,95 15,105 25,105" fill="#5b6eb1" stroke="none" />

        <path d="M170,85 C190,85 190,115 170,115" fill="#7a8ee1" />
        <path d="M175,95 C185,95 185,105 175,105" fill="#5b6eb1" stroke="none" />

        {/* HEAD */}
        <rect x="30" y="60" width="140" height="70" rx="25" fill="#7a8ee1" />
        
        {/* HAPPY EYES ^ ^ */}
        <path d="M70,80 Q75,70 80,80" fill="none" strokeWidth="6" />
        <path d="M120,80 Q125,70 130,80" fill="none" strokeWidth="6" />

        {/* SNOUT */}
        <rect x="75" y="85" width="50" height="30" rx="12" fill="#c3d1f1" />
        
        {/* NOSTRILS (PIG SNOUT) */}
        <line x1="90" y1="100" x2="95" y2="100" strokeWidth="6" stroke="#1c1d21" />
        <line x1="105" y1="100" x2="110" y2="100" strokeWidth="6" stroke="#1c1d21" />
      </g>
    </svg>
  );
}
