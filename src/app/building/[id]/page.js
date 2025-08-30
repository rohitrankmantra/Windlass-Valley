"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import buildingsData from "@/data/buildings.json";
import { motion } from "framer-motion";
import { LiaHomeSolid } from "react-icons/lia";

export default function BuildingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildingId = params?.id;
  const blockQuery = searchParams.get("block");

  // ✅ Find building safely
  const building = Array.isArray(buildingsData)
    ? buildingsData.find((b) => String(b.id) === String(buildingId))
    : buildingsData?.id === buildingId
    ? buildingsData
    : null;

  const [activeBlock, setActiveBlock] = useState(null);

  // ✅ Sync state when query or building changes
  useEffect(() => {
    if (building && building.blocks?.length > 0) {
      if (blockQuery && building.blocks.some((b) => b.id === blockQuery)) {
        setActiveBlock(blockQuery);
      } else {
        setActiveBlock(building.blocks[0].id);
      }
    }
  }, [blockQuery, building]);

  // ⬇️ Conditional rendering only after hooks
  if (!building) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md border border-gray-200"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            className="flex justify-center mb-4"
          >
            <LiaHomeSolid className="text-5xl text-red-500" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">Building Not Found 🚫</h1>
          <p className="text-gray-600 mt-2">
            The building you’re looking for doesn’t exist or may have been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            🔙 Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  if (!building.blocks || building.blocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No blocks found for this building 🚧
      </div>
    );
  }

  const selectedBlock = building.blocks.find((b) => b.id === activeBlock);
  const displayName = `${building.name} - ${selectedBlock?.name || ""}`;

  return (
    <div className="relative min-h-screen p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* 🏢 Building Name */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent drop-shadow-md"
      >
        {displayName}
      </motion.h1>

      {/* 🔹 Block Tabs */}
      <div className="flex flex-wrap gap-4 mt-6">
        {building.blocks.map((block) => (
          <motion.button
            key={block.id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveBlock(block.id);
              router.push(`?block=${block.id}`, { scroll: false });
            }}
            className={`px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-300 
              ${
                activeBlock === block.id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
              }`}
          >
            {block.name}
          </motion.button>
        ))}
      </div>

      {/* 🏠 Flats Row */}
      <div className="flex flex-wrap gap-4 mt-8">
        {selectedBlock?.flats?.map((flat) => {
          const isAvailable = flat.status === "available";
          return (
            <motion.div
              key={flat.flatNo}
              whileHover={isAvailable ? { scale: 1.07 } : {}}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() =>
                isAvailable && router.push(`/building/${buildingId}/${flat.flatNo}`)
              }
              className={`w-28 h-32 flex flex-col items-center justify-center rounded-2xl shadow-lg p-3 transition 
                ${
                  isAvailable
                    ? "cursor-pointer bg-green-100 hover:bg-green-200"
                    : "cursor-not-allowed bg-red-100 opacity-90"
                }`}
            >
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full shadow-md 
                  ${
                    isAvailable
                      ? "bg-gradient-to-br from-green-400 to-green-600"
                      : "bg-gradient-to-br from-red-400 to-red-600"
                  }
                `}
              >
                <LiaHomeSolid className="text-white text-2xl" />
              </div>
              <span
                className={`text-sm font-bold mt-2 ${
                  isAvailable ? "text-green-800" : "text-red-800"
                }`}
              >
                {flat.flatNo}
              </span>
              <span className="text-xs text-gray-700">{flat.bhk}</span>
            </motion.div>
          );
        })}
      </div>

      {/* ✅ Legend Box - top-right */}

{/* ✅ Legend - Top Right (single row, bigger icons & text) */}
<div className="absolute top-8 right-8 flex items-center gap-6 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg">
  {/* Available */}
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-2"
  >
    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-md" />
    <span className="text-base font-bold text-gray-800">Available</span>
  </motion.div>

  {/* Sold */}
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="flex items-center gap-2"
  >
    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md" />
    <span className="text-base font-bold text-gray-800">Sold</span>
  </motion.div>
</div>


    </div>
  );
}
