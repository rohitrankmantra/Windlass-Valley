"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import flatsData from "@/data/flat.json";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaBed,
  FaBath,
  FaCouch,
  FaUnlockAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";

export default function FlatPage() {
  const { id, flatNo } = useParams();
  const [flat, setFlat] = useState(null);
  const [mainImage, setMainImage] = useState("");

  // 🔒 Password state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const foundFlat = flatsData.find(
      (f) =>
        String(f.buildingId) === String(id) &&
        String(f.flatNo) === String(flatNo)
    );
    setFlat(foundFlat);
    if (foundFlat?.images?.length) setMainImage(foundFlat.images[0]);
  }, [id, flatNo]);

  if (!flat) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Flat not found 🚧
      </div>
    );
  }

  // 🔑 Password check
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "1234") {
      setIsAuthorized(true);
      toast.success("✅ Access Granted!");
    } else {
      toast.error("❌ Incorrect Password!");
    }
  };

  return (
    <div className="w-full bg-gray-50 py-8 px-6 min-h-screen relative">
      {/* 🔒 Password Overlay */}
      {!isAuthorized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-md z-50">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
          >
            <FaUnlockAlt className="text-4xl text-purple-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Enter Password to View Flat
            </h2>

            {/* 🔑 Password Input */}
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Unlock
            </button>
          </form>
        </div>
      )}

      {/* 🏠 Flat Content */}
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden flex gap-8 p-8">
        {/* LEFT SIDE: Image Gallery */}
        <div className="w-[55%]">
          {/* Main Image */}
          <div className="w-full h-[470px] rounded-xl overflow-hidden shadow-2 bg-gray-100 border-4 border-blue-500 flex items-center justify-center">
            {mainImage && (
              <Image
                src={mainImage}
                alt="Flat Preview"
                width={800}
                height={600}
                className="w-full h-full object-cover object-center"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            {flat.images?.slice(0, 5).map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                width={150}
                height={150}
                className={`h-20 w-full object-cover object-center rounded-lg cursor-pointer border-2 transition hover:scale-105 ${
                  mainImage === img
                    ? "border-purple-600 shadow-lg"
                    : "border-transparent"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Flat Details */}
        <div className="w-[45%] flex flex-col justify-between">
          <div>
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Flat {flat.flatNo}
            </h1>
            <p className="text-gray-500 flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-purple-500" /> {flat.location}
            </p>

            {/* Status */}
            <div className="mb-6">
              {flat.status === "available" ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  <FaCheckCircle /> AVAILABLE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                  <FaTimesCircle /> SOLD
                </span>
              )}
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <SpecCard icon={<FaBed />} label="Beds" value={flat.bedrooms} />
              <SpecCard icon={<FaBath />} label="Baths" value={flat.bathrooms} />
              <SpecCard
                icon={<FaCouch />}
                label="Balcony"
                value={flat.balconies || 1}
              />
              <SpecCard label="Furnishing" value={flat.furnishing || "N/A"} />
            </div>

            {/* Highlights */}
            <h2 className="text-lg text-gray-600 font-semibold mb-2">
              Highlights
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {flat.highlights?.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:scale-[1.02] transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Spec Card Component
function SpecCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      {icon && <span className="text-purple-500 text-lg">{icon}</span>}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
