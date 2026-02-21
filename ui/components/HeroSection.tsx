const stars = [
  { top: "8%", left: "15%", size: 2, opacity: 0.8 },
  { top: "12%", left: "70%", size: 2, opacity: 0.6 },
  { top: "18%", left: "40%", size: 1.5, opacity: 0.5 },
  { top: "6%", left: "55%", size: 2, opacity: 0.7 },
  { top: "22%", left: "82%", size: 1.5, opacity: 0.4 },
  { top: "14%", left: "28%", size: 1, opacity: 0.6 },
  { top: "25%", left: "60%", size: 2, opacity: 0.5 },
  { top: "10%", left: "90%", size: 1.5, opacity: 0.7 },
];

const platforms = [
  { bottom: "52%", left: "8%", blocks: 5 },
  { bottom: "62%", right: "12%", blocks: 4 },
  { bottom: "42%", left: "35%", blocks: 3 },
];

const coins = [
  { bottom: "68%", right: "20%" },
  { bottom: "48%", left: "40%" },
  { bottom: "58%", left: "55%" },
];

const coinStyle = {
  background: "linear-gradient(135deg, #ffdd44 0%, #ffaa22 100%)",
  boxShadow: "0 0 4px rgba(255,200,50,0.5)",
};

function Platform({ blocks }: { blocks: number }) {
  return (
    <>
      <div className="flex gap-px">
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            className="h-[8px] w-[10px]"
            style={{
              background: i % 2 === 0 ? "#4a9e46" : "#3d8c3a",
              borderTop: "2px solid #5ab856",
            }}
          />
        ))}
      </div>
      <div className="flex gap-px">
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            className="h-[6px] w-[10px]"
            style={{ background: i % 2 === 0 ? "#4a2d1a" : "#3d2415" }}
          />
        ))}
      </div>
    </>
  );
}

export default function HeroSection() {
  return (
    <div className="flex justify-center">
      <div
        className="relative overflow-hidden rounded-[40px]"
        style={{
          width: 280,
          aspectRatio: "9/16",
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d2b55 30%, #3b2d5e 50%, #4a3060 70%, #2d1f3d 100%)",
          boxShadow:
            "0 0 0 4px #2A2A2A, 0 0 0 5px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />

        {/* retro platformer scene */}
        <div className="absolute inset-0">
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.opacity }}
            />
          ))}

          <div
            className="absolute h-[12px] w-[22px] rounded-sm bg-white/20"
            style={{ top: "15%", left: "10%" }}
          />
          <div
            className="absolute h-[10px] w-[16px] rounded-sm bg-white/15"
            style={{ top: "10%", left: "60%" }}
          />

          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "30%",
              background: "linear-gradient(180deg, #4a2d1a 0%, #3d2415 40%, #2e1a0f 100%)",
              borderTop: "3px solid #5ab856",
            }}
          />
          {/* alternating grass blocks along ground top */}
          <div className="absolute left-0 right-0 flex" style={{ bottom: "28%", height: 8 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  background: ["#3d8c3a", "#4a9e46", "#358031"][i % 3],
                  borderTop: "2px solid #5ab856",
                }}
              />
            ))}
          </div>

          {platforms.map((p, i) => (
            <div key={i} className="absolute" style={{ bottom: p.bottom, left: p.left, right: p.right }}>
              <Platform blocks={p.blocks} />
            </div>
          ))}

          {/* character standing on platform 1 */}
          <div className="absolute" style={{ bottom: "55%", left: "22%" }}>
            <div className="flex justify-center">
              <div className="h-[7px] w-[7px] rounded-sm" style={{ background: "#ffcc99" }} />
            </div>
            <div className="flex justify-center">
              <div className="h-[8px] w-[7px]" style={{ background: "#E8553D" }} />
            </div>
            <div className="flex justify-center gap-px">
              <div className="h-[5px] w-[3px]" style={{ background: "#3355aa" }} />
              <div className="h-[5px] w-[3px]" style={{ background: "#2d4a99" }} />
            </div>
          </div>

          {coins.map((c, i) => (
            <div key={i} className="absolute" style={c}>
              <div className="h-[8px] w-[8px] rounded-sm" style={coinStyle} />
            </div>
          ))}

          <div className="absolute" style={{ bottom: "31%", left: "70%" }}>
            <div
              className="h-[7px] w-[6px]"
              style={{
                background: "linear-gradient(180deg, #66ffff 0%, #3399ff 100%)",
                clipPath: "polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)",
              }}
            />
          </div>

          <div className="absolute" style={{ bottom: "30%", left: "80%" }}>
            <div
              className="h-[6px] w-[20px]"
              style={{
                background: "linear-gradient(90deg, #228822 0%, #33aa33 40%, #228822 100%)",
                borderRadius: "2px 2px 0 0",
              }}
            />
            <div
              className="mx-[2px] h-[18px] w-[16px]"
              style={{ background: "linear-gradient(90deg, #1a6e1a 0%, #2d9e2d 40%, #1a6e1a 100%)" }}
            />
          </div>
        </div>

        {/* ── Right sidebar (TikTok icons) ── */}
        <div className="absolute bottom-28 right-3 flex flex-col items-center gap-5">
          {/* Heart */}
          <div className="flex flex-col items-center gap-1">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#E8553D">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-[10px] font-medium text-white/80">
              4.2K
            </span>
          </div>
          {/* Comment */}
          <div className="flex flex-col items-center gap-1">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="white"
              fillOpacity={0.8}
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span className="text-[10px] font-medium text-white/80">328</span>
          </div>
          {/* Share / forward arrow */}
          <div className="flex flex-col items-center gap-1">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="white"
              fillOpacity={0.8}
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 100-6 3 3 0 00-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9a3 3 0 100 6c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 105.84 0 2.92 2.92 0 00-2.92-2.92z" />
            </svg>
            <span className="text-[10px] font-medium text-white/80">
              Share
            </span>
          </div>
        </div>

        {/* ── Bottom content ── */}
        <div className="absolute bottom-8 left-4 right-14">
          {/* Collab avatars + handle */}
          <div className="mb-2 flex items-center gap-2">
            <div className="flex -space-x-2">
              <img
                src="/videos/puck.jpeg"
                alt="Puck"
                className="h-8 w-8 rounded-full object-cover"
                style={{ border: "2px solid rgba(232,85,61,0.6)" }}
              />
              <img
                src="/videos/algenib.jpeg"
                alt="Algenib"
                className="h-8 w-8 rounded-full object-cover"
                style={{ border: "2px solid rgba(255,255,255,0.25)" }}
              />
            </div>
            <span className="font-display text-[13px] font-bold text-white">
              puck &times; algenib
            </span>
          </div>

          {/* Fake caption lines */}
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-white/25" />
            <div className="h-2 w-1/2 rounded-full bg-white/15" />
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <div className="h-full w-2/3 rounded-r-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
