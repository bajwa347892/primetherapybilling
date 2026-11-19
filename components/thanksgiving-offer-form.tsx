"use client";

import { useEffect, useState } from "react";

// Lead form opened from the Thanksgiving popup's "Partner with Prime Therapy Billing Today!" button.
// Colors: banner plum / gold / coral / cream + the site's navy (#0e3256) and blue (#3e8ad6).

const SPECIALTIES = [
  "Behavioral Health",
  "Mental Health Counseling",
  "Physical Therapy",
  "Occupational Therapy",
  "Speech Therapy",
  "Applied Behavior Analysis",
  "Psychiatry",
  "Psychology",
  "Marriage & Family Therapy",
  "Social Work",
  "Addiction Counseling",
  "Neuropsychology",
  "Other",
];

const PERKS = [
  "Free Billing Audit",
  "Free Practice Audit",
  "Benefits Verification",
  "Authorization & Follow-Up",
  "Claims & Posting",
  "EFT & Contracts",
];

const EMPTY = { name: "", email: "", phone: "", practice: "", message: "" };

function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length > 0) return `(${d}`;
  return d;
}

export default function ThanksgivingOfferForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message: form.message.trim() || "Interested in the Thanksgiving 1.99% offer.",
          source: "Thanksgiving Offer Popup",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
      setForm(EMPTY);
    } catch {
      setError("Couldn't send your request. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const set = (key: keyof typeof EMPTY) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [key]: key === "phone" ? formatPhone(e.target.value) : e.target.value });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tg-offer-title"
      className="tg-offer-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(14, 50, 86, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="tg-offer-card relative w-full max-w-[520px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[24px] shadow-2xl"
        style={{ backgroundColor: "#fdf5f0", border: "2px solid #f0b94a" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header: banner plum with gold offer pill ── */}
        <div
          className="relative px-6 sm:px-8 pt-7 pb-6 text-white overflow-hidden"
          style={{ background: "linear-gradient(135deg, #4a0a3a 0%, #7a1458 55%, #9b1d6c 100%)" }}
        >
          {/* soft autumn glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #f6a03c 0%, transparent 70%)" }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/60 text-white/90 hover:bg-white/15 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          <span
            className="inline-block rounded-full px-4 py-1 text-[11px] sm:text-xs font-extrabold tracking-wider"
            style={{ background: "linear-gradient(180deg, #ffd27a 0%, #f0b94a 100%)", color: "#3d0a2e" }}
          >
            🍂 THANKSGIVING · LIMITED TIME OFFER
          </span>

          <h2 id="tg-offer-title" className="mt-3 text-2xl sm:text-[28px] font-extrabold leading-tight">
            Claim Your Thanksgiving Offer
          </h2>

          <div className="mt-2 flex items-end gap-3">
            <span className="text-4xl sm:text-5xl font-black leading-none" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              1.99%
            </span>
            <span className="relative mb-1 text-lg sm:text-xl font-bold text-white/70" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              3.99%
              <span aria-hidden="true" className="absolute left-[-4px] right-[-4px] top-1/2 h-[3px] -rotate-6 rounded" style={{ backgroundColor: "#f0564e" }} />
            </span>
            <span className="mb-1 text-xs sm:text-sm text-white/85">complete therapy billing</span>
          </div>
        </div>

        {/* gold ribbon divider */}
        <div aria-hidden="true" className="h-[5px]" style={{ background: "linear-gradient(90deg, #c98a1e, #ffd27a, #c98a1e)" }} />

        <div className="px-6 sm:px-8 py-6">
          {success ? (
            <div className="py-6 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "#f6e3ee" }}
              >
                <svg className="h-8 w-8" fill="none" stroke="#7a1458" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold" style={{ color: "#0e3256" }}>
                Your offer is reserved!
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Thanks for partnering with Prime Therapy Billing. Our team will reach out within{" "}
                <span className="font-semibold" style={{ color: "#7a1458" }}>24–48 business hours</span> to lock in your
                1.99% rate and schedule your free audits.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl px-7 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #0e3256, #3e8ad6)" }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* What's included */}
              <ul className="mb-5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]" style={{ color: "#0e3256" }}>
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                      style={{ backgroundColor: "#7a1458" }}
                    >
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <form className="space-y-3" onSubmit={submit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="tg-field" type="text" placeholder="Full Name" required autoComplete="name" value={form.name} onChange={set("name")} aria-label="Full name" />
                  <input className="tg-field" type="tel" placeholder="(555) 123-4567" required autoComplete="tel" value={form.phone} onChange={set("phone")} aria-label="Phone number" />
                </div>
                <input className="tg-field" type="email" placeholder="Email Address" required autoComplete="email" value={form.email} onChange={set("email")} aria-label="Email address" />
                <select className="tg-field" required value={form.practice} onChange={set("practice")} aria-label="Specialty" style={{ color: form.practice ? "#1f2937" : "#9ca3af" }}>
                  <option value="">Select Your Specialty</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s} style={{ color: "#1f2937" }}>{s}</option>
                  ))}
                </select>
                <textarea className="tg-field resize-none" rows={2} placeholder="Anything we should know? (optional)" value={form.message} onChange={set("message")} aria-label="Message" />

                {error && (
                  <p role="alert" className="text-sm font-medium" style={{ color: "#d93a3a" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ background: "linear-gradient(180deg, #f5655b 0%, #e0403c 100%)" }}
                >
                  {loading ? "Sending..." : "Claim My 1.99% Offer"}
                  {!loading && (
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-500">
                  🔒 Your information is secure and HIPAA compliant ·{" "}
                  <span className="italic" style={{ color: "#7a1458" }}>Terms and Conditions Applied.</span>
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        .tg-field {
          width: 100%;
          padding: 0.75rem 0.9rem;
          border-radius: 0.75rem;
          border: 1.5px solid #ecd9cf;
          background: #ffffff;
          font-size: 0.875rem;
          color: #1f2937;
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .tg-field::placeholder { color: #9ca3af; }
        .tg-field:focus { border-color: #3e8ad6; box-shadow: 0 0 0 3px rgba(62, 138, 214, 0.18); }
        .tg-offer-overlay { animation: tg-offer-fade 220ms ease-out; }
        .tg-offer-card { animation: tg-offer-pop 320ms cubic-bezier(.2,.9,.3,1.2); }
        @keyframes tg-offer-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tg-offer-pop { from { opacity: 0; transform: translateY(12px) scale(.96) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) {
          .tg-offer-overlay, .tg-offer-card { animation: none; }
        }
      `}</style>
    </div>
  );
}
