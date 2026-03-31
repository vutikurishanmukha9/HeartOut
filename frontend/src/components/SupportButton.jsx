import React, { useState, useEffect, useRef } from "react";

export const reactions = [
  {
    key: "felt_this",
    label: "Felt This",
    color: "#ef4444",
    bg: "#fef2f2",
    activeBg: "#fee2e2",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Cracked heart — a heart that has actually felt something */}
        <path
          d="M17 28 C17 28 6 20 6 12.5 A6.5 6.5 0 0 1 17 8 A6.5 6.5 0 0 1 28 12.5 C28 20 17 28 17 28Z"
          fill="#fca5a5"
          stroke="#ef4444"
          strokeWidth="1.5"
        />
        {/* Crack lines radiating from heart center */}
        <path d="M15 14 L17 17 L19 15" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M17 17 L16 20" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        {/* Small radiating lines at top */}
        <path d="M10 9 Q8 6 10 4" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M24 9 Q26 6 24 4" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M17 8 L17 5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "holding_space",
    label: "Holding Space",
    color: "#ea580c",
    bg: "#fff7ed",
    activeBg: "#ffedd5",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Two open upward palms — an offering */}
        <ellipse cx="17" cy="26.5" rx="10" ry="3.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2"/>
        {/* Left arm */}
        <path d="M10 26.5 Q8 19 11 13" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        {/* Right arm */}
        <path d="M24 26.5 Q26 19 23 13" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        {/* Cupped top */}
        <path d="M11 13 Q14 8 17 10 Q20 8 23 13" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        {/* Palm line */}
        <path d="M13 18 Q17 20 21 18" stroke="#ea580c" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    key: "moved",
    label: "Moved",
    color: "#3b82f6",
    bg: "#eff6ff",
    activeBg: "#dbeafe",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Face with one perfect teardrop falling as ripple */}
        <circle cx="17" cy="13" r="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5"/>
        <circle cx="14.5" cy="12" r="1" fill="#3b82f6"/>
        <circle cx="19.5" cy="12" r="1" fill="#3b82f6"/>
        {/* Gentle smile — moved but okay */}
        <path d="M14 15.5 Q17 18 20 15.5" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        {/* Single teardrop falling */}
        <path d="M17 19 L15.5 26" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round"/>
        {/* Ripple where tear lands */}
        <ellipse cx="15" cy="27.5" rx="2.5" ry="1" fill="none" stroke="#bfdbfe" strokeWidth="1"/>
        <ellipse cx="15" cy="27.5" rx="1.2" ry="0.5" fill="#bfdbfe"/>
      </svg>
    ),
  },
  {
    key: "brave",
    label: "Brave",
    color: "#7c3aed",
    bg: "#f5f3ff",
    activeBg: "#ede9fe",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Star with a glowing inner star — a lighthouse, not a reward */}
        <path
          d="M17 5 L20 14 L29 14 L22 20 L25 29 L17 23 L9 29 L12 20 L5 14 L14 14 Z"
          fill="#c4b5fd"
          stroke="#7c3aed"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Inner glowing core */}
        <path
          d="M17 10 L18.5 15 L23 15 L19.5 18 L21 23 L17 20 L13 23 L14.5 18 L11 15 L15.5 15 Z"
          fill="#7c3aed"
        />
      </svg>
    ),
  },
  {
    key: "grateful",
    label: "Grateful",
    color: "#16a34a",
    bg: "#f0fdf4",
    activeBg: "#dcfce7",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Seed cracking open with light bursting out — gratitude grows from inside */}
        <circle cx="17" cy="18" r="9" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5"/>
        {/* Seed/leaf shape inside */}
        <path d="M11 18 Q17 11 23 18 Q17 25 11 18Z" fill="#16a34a"/>
        {/* Light rays bursting outward */}
        <path d="M8 11 Q6 8 8 6" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M26 11 Q28 8 26 6" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M11 8 Q10 5 12 4" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M23 8 Q24 5 22 4" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M17 9 L17 5" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// Alias for components expecting `reactionTypes` syntax using `value` instead of `key`
export const reactionTypes = reactions.map(r => ({ ...r, value: r.key }));

export default function ReactionButton({ storyId, currentReaction, onReact, supportCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle reaction submission seamlessly with PostDetail.jsx
  const handleReact = (key) => {
    const next = currentReaction === key ? null : key;
    setAnimating(key);
    setTimeout(() => setAnimating(null), 400);
    setOpen(false);
    if (onReact) onReact(next);
  };

  const current = reactions.find((r) => r.key === currentReaction);

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block", userSelect: "none", zIndex: 10 }}>

      {/* Popup reaction picker */}
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: 0, /* Align to left edge of button to prevent jumping off screen */
            background: "white",
            border: "0.5px solid #e5e7eb",
            borderRadius: "20px",
            padding: "10px 14px",
            display: "flex",
            gap: "6px",
            alignItems: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            zIndex: 100,
            whiteSpace: "nowrap",
          }}
        >
          {reactions.map((r) => (
            <button
              key={r.key}
              title={r.label}
              onClick={() => handleReact(r.key)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: currentReaction === r.key ? `2px solid ${r.color}` : "2px solid transparent",
                background: currentReaction === r.key ? r.activeBg : r.bg,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.15s, background 0.15s",
                transform: animating === r.key ? "scale(1.35)" : "scale(1)",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.2) translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {r.icon}
            </button>
          ))}

          {/* Tooltip labels below icons */}
          <div
            style={{
              position: "absolute",
              bottom: "-22px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-around",
              pointerEvents: "none",
            }}
          >
            {reactions.map((r) => (
              <span
                key={r.key}
                style={{
                  fontSize: "9px",
                  color: r.color,
                  fontWeight: 500,
                  textAlign: "center",
                  width: "44px",
                  letterSpacing: "0.2px",
                }}
              >
                {r.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main React button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "8px 16px",
          borderRadius: "20px",
          border: currentReaction
            ? `1.5px solid ${current?.color}40`
            : "1px solid #e5e7eb",
          background: currentReaction ? current?.activeBg : "white",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          color: currentReaction ? current?.color : "#6b7280",
          transition: "all 0.2s",
          fontFamily: "inherit",
        }}
      >
        {currentReaction ? (
          <>
            {current?.icon}
            {current?.label}
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-9-5.5-9-11A6 6 0 0 1 12 6a6 6 0 0 1 9 4c0 5.5-9 11-9 11z"
                stroke="#9ca3af"
                strokeWidth="1.8"
                fill="none"
              />
            </svg>
            React
          </>
        )}
        
        {/* Support Count Integration */}
        {supportCount > 0 && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "10px",
              background: currentReaction ? "rgba(255,255,255,0.6)" : "#f3f4f6",
              marginLeft: "4px"
            }}
          >
            {supportCount}
          </span>
        )}
      </button>
    </div>
  );
}