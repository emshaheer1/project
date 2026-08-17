export function HeroDnaBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Soft DNA wash across hero */}
      <svg
        className="absolute -right-[8%] top-[-6%] h-[118%] w-auto opacity-[0.22] hero-dna-drift"
        viewBox="0 0 420 900"
        fill="none"
      >
        <defs>
          <linearGradient id="dnaStrokeA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2eb8cf" stopOpacity="0" />
            <stop offset="18%" stopColor="#2eb8cf" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#b8953a" stopOpacity="0.75" />
            <stop offset="82%" stopColor="#2eb8cf" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2eb8cf" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dnaStrokeB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8953a" stopOpacity="0" />
            <stop offset="20%" stopColor="#b8953a" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#1a9bb0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#b8953a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left strand */}
        <path
          d="M150 20 C70 90, 330 160, 150 230 C70 300, 330 370, 150 440 C70 510, 330 580, 150 650 C70 720, 330 790, 150 860"
          stroke="url(#dnaStrokeA)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Right strand */}
        <path
          d="M270 20 C350 90, 90 160, 270 230 C350 300, 90 370, 270 440 C350 510, 90 580, 270 650 C350 720, 90 790, 270 860"
          stroke="url(#dnaStrokeB)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Base-pair rungs */}
        {[
          [110, 310, 95],
          [95, 325, 165],
          [125, 295, 235],
          [90, 330, 305],
          [120, 300, 375],
          [95, 325, 445],
          [125, 295, 515],
          [90, 330, 585],
          [120, 300, 655],
          [95, 325, 725],
          [125, 295, 795],
        ].map(([x1, x2, y], i) => (
          <g key={y}>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={i % 2 === 0 ? "rgba(46,184,207,0.55)" : "rgba(184,149,58,0.45)"}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <circle cx={x1} cy={y} r="3.2" fill={i % 2 === 0 ? "#2eb8cf" : "#b8953a"} opacity="0.7" />
            <circle cx={x2} cy={y} r="3.2" fill={i % 2 === 0 ? "#b8953a" : "#2eb8cf"} opacity="0.7" />
          </g>
        ))}
      </svg>

      {/* Secondary smaller helix on the left */}
      <svg
        className="absolute -left-[12%] bottom-[-10%] h-[70%] w-auto rotate-12 opacity-[0.12] hero-dna-drift-slow"
        viewBox="0 0 420 900"
        fill="none"
      >
        <path
          d="M150 20 C70 90, 330 160, 150 230 C70 300, 330 370, 150 440 C70 510, 330 580, 150 650 C70 720, 330 790, 150 860"
          stroke="#2eb8cf"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M270 20 C350 90, 90 160, 270 230 C350 300, 90 370, 270 440 C350 510, 90 580, 270 650 C350 720, 90 790, 270 860"
          stroke="#b8953a"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {[95, 165, 235, 305, 375, 445, 515, 585, 655, 725].map((y, i) => (
          <line
            key={y}
            x1={i % 2 === 0 ? 110 : 95}
            y1={y}
            x2={i % 2 === 0 ? 310 : 325}
            y2={y}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
          />
        ))}
      </svg>

      {/* Soft glow nodes */}
      <div className="absolute top-[18%] right-[18%] h-40 w-40 rounded-full bg-[rgba(46,184,207,0.12)] blur-3xl" />
      <div className="absolute bottom-[22%] right-[28%] h-48 w-48 rounded-full bg-[rgba(184,149,58,0.1)] blur-3xl" />
    </div>
  );
}
