"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Popup opened from the Thanksgiving promo ticker in the header.
// Designed as a "harvest coupon ticket" with a built-in savings estimator.
// Colors: ticker browns (#5c2d13 / #6a3613 / #85532c) + autumn gold (#f0b94a)
// + the site's navy (#0e3256) and blue (#3e8ad6).

const OLD_RATE = 3.99;
const NEW_RATE = 1.99;
const MIN = 10000;
const MAX = 300000;
const STEP = 5000;

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function ThanksgivingTickerPopup({
  onClose,
  onClaim,
}: {
  onClose: () => void;
  onClaim: () => void;
}) {
  const [monthly, setMonthly] = useState(50000);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const monthlySavings = (monthly * (OLD_RATE - NEW_RATE)) / 100;
  const yearlySavings = monthlySavings * 12;
  const fill = ((monthly - MIN) / (MAX - MIN)) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tg-ticket-title"
      className="tg-ticket-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(14, 50, 86, 0.62)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="tg-ticket-card relative w-full max-w-[460px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[22px] shadow-2xl"
        style={{ backgroundColor: "#fff8ef" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top: autumn photo with the ticker's brown overlay ── */}
        <div
          className="relative overflow-hidden px-6 pb-7 pt-6 text-white"
          style={{
            backgroundColor: "#5c2d13",
            backgroundImage:
              "linear-gradient(160deg, rgba(70,30,10,0.55) 0%, rgba(92,45,19,0.8) 60%, rgba(14,50,86,0.85) 100%), url('/thanksgiving-ticker-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            textShadow: "0 1px 2px rgba(0,0,0,0.45)",
          }}
        >
          {/* falling leaves */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {["8%", "28%", "52%", "74%", "90%"].map((left, i) => (
              <span
                key={left}
                className="tg-leaf absolute -top-6 text-lg"
                style={{ left, animationDelay: `${i * 1.3}s`, animationDuration: `${6 + (i % 3)}s` }}
              >
                {i % 2 ? "🍁" : "🍂"}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/60 text-white/90 transition-colors hover:bg-white/15 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          <p className="relative text-[11px] font-extrabold uppercase tracking-[0.25em]" style={{ color: "#ffd27a" }}>
            Harvest Savings Ticket
          </p>
          <h2 id="tg-ticket-title" className="relative mt-2 text-[26px] font-extrabold leading-tight">
            Thanksgiving Special
          </h2>
          <div className="relative mt-3 flex items-end gap-3" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <span className="text-5xl font-black leading-none" style={{ color: "#ffd27a" }}>
              {NEW_RATE}%
            </span>
            <span className="relative mb-1 text-xl font-bold text-white/70">
              {OLD_RATE}%
              <span
                aria-hidden="true"
                className="absolute left-[-4px] right-[-4px] top-1/2 h-[3px] -rotate-6 rounded"
                style={{ backgroundColor: "#f0564e" }}
              />
            </span>
          </div>
          <p className="relative mt-1 text-sm text-white/90">Complete therapy medical billing, half the usual rate.</p>
        </div>

        {/* ── Perforated tear line ── */}
        <div aria-hidden="true" className="relative h-0">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full" style={{ backgroundColor: "rgba(14,50,86,0.62)" }} />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full" style={{ backgroundColor: "rgba(14,50,86,0.62)" }} />
          <div className="mx-5 border-t-2 border-dashed" style={{ borderColor: "#e3c9a8" }} />
        </div>

        {/* ── Stub: savings estimator ── */}
        <div className="px-6 pb-6 pt-5">
          <label htmlFor="tg-ticket-range" className="flex items-baseline justify-between text-sm font-semibold" style={{ color: "#0e3256" }}>
            Your monthly collections
            <span className="text-base font-extrabold" style={{ color: "#6a3613" }}>{money(monthly)}</span>
          </label>
          <input
            id="tg-ticket-range"
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="tg-range mt-3 w-full"
            style={{ background: `linear-gradient(90deg, #85532c 0%, #f0b94a ${fill}%, #ecdcc8 ${fill}%)` }}
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border px-4 py-3" style={{ borderColor: "#ecdcc8", backgroundColor: "#ffffff" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">You save / month</p>
              <p className="mt-1 text-xl font-extrabold" style={{ color: "#3e8ad6" }}>{money(monthlySavings)}</p>
            </div>
            <div
              className="rounded-2xl px-4 py-3 text-white"
              style={{ background: "linear-gradient(135deg, #0e3256 0%, #1d4f82 100%)" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#ffd27a" }}>You save / year</p>
              <p className="mt-1 text-xl font-extrabold">{money(yearlySavings)}</p>
            </div>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2">
            {["Free Billing Audit", "Free Practice Audit", "Benefits Verification"].map((perk) => (
              <li
                key={perk}
                className="rounded-full px-3 py-1 text-[12px] font-semibold"
                style={{ backgroundColor: "#f6e6d2", color: "#5c2d13" }}
              >
                ✓ {perk}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onClaim}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: "linear-gradient(180deg, #ffd27a 0%, #f0b94a 100%)", color: "#3d1a08" }}
          >
            Claim My 1.99% Deal
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <Link
            href="/contact-us"
            onClick={onClose}
            className="mt-3 block text-center text-sm font-semibold underline-offset-4 hover:underline"
            style={{ color: "#0e3256" }}
          >
            Rather talk first? Contact our team
          </Link>
          <p className="mt-3 text-center text-[11px] text-gray-500">
            Estimate based on the {OLD_RATE}% standard rate. Terms apply.
          </p>
        </div>
      </div>

      <style>{`
        .tg-ticket-overlay { animation: tg-ticket-fade 220ms ease-out; }
        .tg-ticket-card { animation: tg-ticket-drop 420ms cubic-bezier(.2,.9,.3,1.2); transform-origin: top center; }
        .tg-leaf { animation-name: tg-leaf-fall; animation-timing-function: linear; animation-iteration-count: infinite; opacity: .8; }
        .tg-range { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 9999px; outline: none; cursor: pointer; }
        .tg-range::-webkit-slider-thumb { -webkit-appearance: none; height: 22px; width: 22px; border-radius: 50%; background: #0e3256; border: 3px solid #ffd27a; box-shadow: 0 2px 6px rgba(0,0,0,.25); }
        .tg-range::-moz-range-thumb { height: 18px; width: 18px; border-radius: 50%; background: #0e3256; border: 3px solid #ffd27a; }
        .tg-range:focus-visible { box-shadow: 0 0 0 3px rgba(62,138,214,.35); }
        @keyframes tg-ticket-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tg-ticket-drop { from { opacity: 0; transform: translateY(-24px) rotate(-2deg) } to { opacity: 1; transform: none } }
        @keyframes tg-leaf-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: .85; }
          100% { transform: translateY(240px) rotate(300deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tg-ticket-overlay, .tg-ticket-card { animation: none; }
          .tg-leaf { display: none; }
        }
      `}</style>
    </div>
  );
}
