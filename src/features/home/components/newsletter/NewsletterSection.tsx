import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

// ── Real newsletter collage images (215×276 left, 200×221 right) ──
import newsletterLeft  from "@/assets/images/newsletter/newsletter-left.png";
import newsletterRight from "@/assets/images/newsletter/newsletter-right.png";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only — no newsletter backend implemented.
    setEmail("");
  };

  return (
    <section className="bg-white dark:bg-[#0B1220] py-8 sm:py-10">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">

        {/*
          ── Blue Newsletter Container ──
          min-h: 435px to match reference desktop height.
          position: relative so all absolute children are anchored here.
          overflow-hidden clips images and decorative shapes at rounded corners.
        */}
        <div
          className="relative overflow-hidden rounded-[20px] bg-[#3C65F5]"
          style={{ minHeight: 435 }}
        >

          {/* ──────────────────────────────────────────
              DECORATIVE BACKGROUND SHAPES  (z-0)
              Translucent white ovals — partially clipped
              at the bottom edge of the container.
          ────────────────────────────────────────── */}

          {/* Large oval — bottom-center */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              bottom: -100,
              left: "50%",
              transform: "translateX(-50%)",
              width: 380,
              height: 260,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
            }}
          />

          {/* Smaller oval — slightly right of center-bottom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              bottom: -80,
              left: "56%",
              transform: "translateX(-50%)",
              width: 290,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
            }}
          />

          {/* ──────────────────────────────────────────
              FLOATING IMAGES  (z-10)
              Composite PNG collages positioned on each
              side. Hidden on small screens via md:block.
              Natural image size scaled to fit container.
          ────────────────────────────────────────── */}

          {/* Left collage (215×276 px source) */}
          <img
            src={newsletterLeft}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute z-10 hidden select-none md:block"
            style={{
              top: "50%",
              left: 30,
              transform: "translateY(-50%)",
              width: 215,
              height: "auto",
              maxHeight: 390,
              objectFit: "cover",
            }}
          />

          {/* Right collage (200×221 px source) */}
          <img
            src={newsletterRight}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute z-10 hidden select-none md:block"
            style={{
              top: "50%",
              right: 30,
              transform: "translateY(-50%)",
              width: 200,
              height: "auto",
              maxHeight: 350,
              objectFit: "cover",
            }}
          />

          {/* ──────────────────────────────────────────
              MAIN CONTENT  (z-20)
              Heading + form, always centered and above
              all decorative elements.
          ────────────────────────────────────────── */}
          <div
            className="relative z-20 flex flex-col items-center justify-center"
            style={{ minHeight: 435, padding: "40px 16px" }}
          >

            {/*
              Heading: max-w-[500px] at text-[40px] forces the correct
              2-line break → "New Things Will Always / Update Regularly"
            */}
            <h2
              className="mb-8 text-center font-bold text-white"
              style={{
                fontSize: 40,
                lineHeight: 1.22,
                maxWidth: 500,
              }}
            >
              New Things Will Always Update Regularly
            </h2>

            {/*
              Subscription form:
              - Target width ≈ 547px, height ≈ 80px
              - White rounded pill container
              - [Mail icon] [input] [Subscribe button]
            */}
            <form
              onSubmit={handleSubscribe}
              className="flex w-full items-center rounded-full bg-white"
              style={{
                maxWidth: 547,
                padding: "10px 10px 10px 20px",
              }}
            >
              {/* Mail icon — left of input */}
              <Mail
                className="shrink-0 text-[#66789C]"
                style={{ width: 20, height: 20, marginRight: 10 }}
              />

              {/* Email input */}
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email here"
                autoComplete="email"
                className="min-w-0 flex-1 bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                style={{ fontSize: 14 }}
              />

              {/* Subscribe button — blue pill inside white form */}
              <button
                type="submit"
                className="ml-3 flex shrink-0 items-center gap-2 rounded-full bg-[#3C65F5] font-semibold text-white transition-colors duration-200 hover:bg-[#2a4fd6] active:bg-[#2244c4]"
                style={{
                  padding: "14px 24px",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                Subscribe
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
