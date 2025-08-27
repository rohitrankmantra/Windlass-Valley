"use client";
import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
} from "react-icons/fa";
import Link from "next/link";

export default function HomePage() {
  // 🎯 All Locations
  const locations = [
    // 🏢 Alaknanda Towers (grouped by blocks)
    { id: "alaknanda", block: "A1", name: "Alaknanda 1", x: "40%", y: "25%", type: "res" },
    { id: "alaknanda", block: "A2", name: "Alaknanda 2", x: "40%", y: "21%", type: "res" },
    { id: "alaknanda", block: "A3", name: "Alaknanda 3", x: "43%", y: "18%", type: "res" },
    { id: "alaknanda", block: "A4", name: "Alaknanda 4", x: "46%", y: "22%", type: "res" },
    { id: "alaknanda", block: "A5", name: "Alaknanda 5", x: "50%", y: "21%", type: "res" },
    { id: "alaknanda", block: "A6", name: "Alaknanda 6", x: "54%", y: "23%", type: "res" },
    { id: "alaknanda", block: "A7", name: "Alaknanda 7", x: "50%", y: "28%", type: "res" },
    { id: "alaknanda", block: "A8", name: "Alaknanda 8", x: "50%", y: "32%", type: "res" },
    { id: "alaknanda", block: "A9", name: "Alaknanda 9", x: "45%", y: "32%", type: "res" },
    { id: "alaknanda", block: "A10", name: "Alaknanda 10", x: "44%", y: "27%", type: "res" },
    // 🏢 Other Towers
    { id: "alaknandaextension", name: "Alaknanda Extension", x: "33%", y: "20%", type: "res" },
    { id: "skyvilla", name: "Skyvilla", x: "35%", y: "34%", type: "res" },
    { id: "kaveri1", name: "Kaveri 1", x: "42%", y: "34%", type: "res" },
    { id: "kaveri2", name: "Kaveri 2", x: "48%", y: "38%", type: "res" },
    { id: "kaveri3", name: "Kaveri 3", x: "45%", y: "47%", type: "res" },
    { id: "kaveri4", name: "Kaveri 4", x: "38%", y: "42%", type: "res" },
    { id: "kaveri5", name: "Kaveri 5", x: "32%", y: "38%", type: "res" },
    { id: "kaveri6", name: "Kaveri 6", x: "29%", y: "30%", type: "res" },
    { id: "lakeforest", name: "Lake Forest", x: "42%", y: "39%", type: "res" },
    { id: "ganga1", name: "Ganga 1", x: "52%", y: "50%", type: "res" },
    { id: "ganga2", name: "Ganga 2", x: "56%", y: "46%", type: "res" },
    { id: "ganga3", name: "Ganga 3", x: "52%", y: "42%", type: "res" },
    { id: "ganga4", name: "Ganga 4", x: "56%", y: "40%", type: "res" },
    { id: "narmadatower", name: "Narmada Tower Upcoming", x: "72%", y: "43%", type: "res" },
    { id: "bhagirathi1", name: "Bhagirathi 1", x: "58%", y: "36%", type: "res" },
    { id: "bhagirathi2", name: "Bhagirathi 2", x: "55%", y: "32%", type: "res" },
    { id: "bhagirathi3", name: "Bhagirathi 3", x: "60%", y: "31%", type: "res" },
    { id: "bhagirathi4", name: "Bhagirathi 4", x: "58%", y: "26%", type: "res" },

    // 🏫 Facilities
    { id: "school", name: "School", x: "50%", y: "58%", type: "fac" },
    { id: "hospital", name: "Hospital", x: "40%", y: "55%", type: "fac" },
    { id: "club", name: "Club", x: "60%", y: "64%", type: "fac" },
    { id: "mall", name: "Mall", x: "40%", y: "90%", type: "fac" },
    { id: "hotel", name: "Hotel", x: "44%", y: "76%", type: "fac" },
    { id: "entrygate", name: "Entry Gate", x: "33%", y: "88%", type: "fac" },
    { id: "highway", name: "NH Highway", x: "26%", y: "92%", type: "fac" },

    // ⚽ Sports
    { id: "football", name: "Football", x: "64%", y: "40%", type: "sport" },
    { id: "volleyball", name: "Volleyball", x: "62%", y: "46%", type: "sport" },
    { id: "basketball", name: "Basketball", x: "60%", y: "59%", type: "sport" },
    { id: "lawntennis", name: "Lawn Tennis", x: "68%", y: "36%", type: "sport" },
    { id: "badminton", name: "Badminton", x: "71%", y: "38%", type: "sport" },
  ];

  // 🔍 Zoom state
  const [scale, setScale] = useState(1);
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div className="relative w-screen h-screen overflow-auto bg-black">
      {/* 🔍 Zoom Controls */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="bg-white p-4 rounded-full shadow hover:bg-gray-200 cursor-pointer"
        >
          <FaSearchPlus className="text-2xl text-blue-600" />
        </button>
        <button
          onClick={zoomOut}
          className="bg-white p-4 rounded-full shadow hover:bg-gray-200 cursor-pointer"
        >
          <FaSearchMinus className="text-2xl text-blue-600" />
        </button>
        <button
          onClick={resetZoom}
          className="bg-white p-4 rounded-full shadow hover:bg-gray-200 cursor-pointer"
        >
          <FaExpand className="text-2xl text-blue-600" />
        </button>
      </div>

      {/* 🗺️ Map */}
      <div
        className="relative inline-block origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <img
          src="/master-layout.jpg"
          alt="Master Layout"
          className="max-w-none w-full h-full object-cover"
        />

        {/* 📍 Pins + Labels */}
        {locations.map((loc, i) => {
          const isAlaknanda = loc.block;

          // ✅ Always pass buildingId + block (when available)
          const href = isAlaknanda
            ? `/building/${loc.id}?block=${loc.block}` // e.g. /building/alaknanda1?block=A1
            : `/building/${loc.id}`;

          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                top: loc.y,
                left: loc.x,
                transform: "translate(-50%, -100%)",
              }}
            >
              <Link href={href}>
                <div className="flex flex-col items-center cursor-pointer group">
                  <FaMapMarkerAlt className="text-red-600 text-2xl animate-pin bg-white/90 rounded-full p-1 group-hover:scale-125 transition" />
                  <span className="text-black text-[11px] mt-0.5 bg-white/90 px-2 py-0.5 rounded whitespace-nowrap transition group-hover:bg-blue-600 group-hover:text-white">
                    {loc.name}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* ✨ Animations */}
      <style jsx global>{`
        @keyframes pinPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.9;
          }
        }
        .animate-pin {
          animation: pinPulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
