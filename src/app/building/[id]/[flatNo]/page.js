"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import flatsData from "@/data/flat.json";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaBed,
  FaBath,
  FaCouch,
  FaUnlockAlt,
  FaEye,
  FaEyeSlash,
  FaUpload,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import SignatureCanvas from "react-signature-canvas";

export default function FlatPage() {
  const { id, flatNo } = useParams();
  const [flat, setFlat] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const { width, height } = useWindowSize();
  const audioRef = useRef(null);

  // ✍ Signature states
  const [signature, setSignature] = useState(null);
  const sigCanvas = useRef(null);

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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "1234") {
      setIsAuthorized(true);
      toast.success("✅ Access Granted!");
    } else {
      toast.error("❌ Incorrect Password!");
    }
  };

  // 🎵 Play music + confetti
  const handleBookNow = () => {
    if (!signature) {
      toast.error("✍️ Please provide your signature first!");
      return;
    }
    setShowSuccess(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.log("⚠️ Audio play blocked:", err);
      });
    }
  };

  // ❌ Stop music + confetti
  const handleClosePopup = () => {
    setShowSuccess(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // 📂 Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSignature(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ✍ Capture drawn signature
  const handleSaveSignature = () => {
    if (sigCanvas.current) {
      setSignature(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
      toast.success("🖊 Signature saved!");
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
        {/* LEFT SIDE */}
        <div className="w-[55%]">
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

        {/* RIGHT SIDE */}
        <div className="w-[45%] flex flex-col justify-between">
          <div>
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

            <h2 className="text-lg text-gray-600 font-semibold mb-2">
              Highlights
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
              {flat.highlights?.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>

            {/* ✍ Signature Section */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Provide Your Signature
              </h3>
              {/* Upload file */}
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <FaUpload className="text-purple-500" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="text-sm text-purple-600 underline">
                  Upload Signature File
                </span>
              </label>

              {/* Digital Signature Pad */}
              <div className="border rounded-lg p-3 bg-gray-50">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{ className: "w-full h-32 bg-white rounded" }}
                />
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => sigCanvas.current.clear()}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSaveSignature}
                    className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Save Signature
                  </button>
                </div>
              </div>

              {signature && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">
                    ✅ Your Signature:
                  </p>
                  <img
                    src={signature}
                    alt="User signature"
                    className="h-16 border rounded shadow"
                  />
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleBookNow}
            className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:scale-[1.02] transition"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* 🎉 Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 overflow-hidden">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={500}
            recycle={true}
            gravity={0.3}
          />

          <div className="relative bg-white p-10 rounded-2xl shadow-2xl text-center w-[90%] max-w-md animate-fadeIn z-10">
            <h2 className="text-3xl font-bold text-purple-600 mb-4 animate-bounce">
              🎉 Congratulations 🎉
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Welcome to your sweet home, Flat {flat.flatNo}! 🏡
            </p>
            <button
              onClick={handleClosePopup}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow hover:scale-105 transition"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* 🔊 Hidden Audio Player */}
      <audio ref={audioRef} loop className="hidden">
        <source src="/sound/music.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

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
