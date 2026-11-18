"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const OPEN_DELAY_MS = 800;
// After the visitor closes it the first time, show it once more after this delay.
const REOPEN_DELAY_MS = 15000;
const MAX_SHOWS = 2;

export default function ThanksgivingPopup() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Opens on every full site load/refresh. Moving between pages doesn't reopen it,
  // because the layout (and this component) stays mounted during client navigation.
  const showCount = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    showCount.current += 1;
    setOpen(true);
  }

  useEffect(() => {
    timer.current = setTimeout(show, OPEN_DELAY_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // reopen=false when the visitor clicked the CTA, so it never covers the form they opened.
  function close(reopen = true) {
    setOpen(false);
    if (timer.current) clearTimeout(timer.current);
    if (reopen && showCount.current < MAX_SHOWS) {
      timer.current = setTimeout(show, REOPEN_DELAY_MS);
    }
  }

  // Opens the same form popup as the home page hero's primary button.
  function openHeroPopup() {
    close(false);
    if (pathname === "/") {
      // Let this popup unmount first so the body scroll lock hands over cleanly.
      setTimeout(() => window.dispatchEvent(new Event("open-hero-popup")), 0);
    } else {
      try {
        sessionStorage.setItem("ptb-open-hero-popup", "1");
      } catch {}
      router.push("/");
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Happy Thanksgiving: complete therapy billing services at just 1.99% (was 3.99%)"
      className="tg-popup-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={() => close()}
    >
      <div
        className="tg-popup-card relative w-full max-w-[920px] overflow-hidden rounded-[22px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src="/thanksgiving-popup.png"
          alt="Prime Therapy Billing - Happy Thanksgiving. Get complete therapy billing services at just 1.99% (was 3.99%). Limited time offer. Free Billing Audit. Free Practice Audit. Benefits Verification, Authorization & Follow-Up, Claims & Posting, EFT & Contracts. Terms and Conditions Applied."
          width={1672}
          height={941}
          priority
          sizes="(max-width: 960px) 100vw, 920px"
          className="block h-auto w-full select-none"
          draggable={false}
        />

        {/* Clickable area over the X button in the design */}
        <button
          type="button"
          onClick={() => close()}
          aria-label="Close offer"
          className="absolute rounded-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7a1458]"
          style={{ left: "92.4%", top: "3.6%", width: "5%", height: "8.8%" }}
        />

        {/* Clickable area over the "Partner with Prime Therapy Billing Today!" button */}
        <button
          type="button"
          onClick={openHeroPopup}
          aria-label="Partner with Prime Therapy Billing Today"
          className="tg-popup-cta absolute rounded-[12px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          style={{ left: "4.1%", top: "79.1%", width: "50.8%", height: "9.2%" }}
        />
      </div>

      <style>{`
        .tg-popup-overlay { animation: tg-fade 250ms ease-out; }
        .tg-popup-card { animation: tg-pop 350ms cubic-bezier(.2,.9,.3,1.2); }
        .tg-popup-cta { transition: background-color 150ms ease; }
        .tg-popup-cta:hover { background-color: rgba(255,255,255,0.12); }
        @keyframes tg-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tg-pop { from { opacity: 0; transform: scale(.92) } to { opacity: 1; transform: scale(1) } }
        @media (prefers-reduced-motion: reduce) {
          .tg-popup-overlay, .tg-popup-card { animation: none; }
        }
      `}</style>
    </div>
  );
}
