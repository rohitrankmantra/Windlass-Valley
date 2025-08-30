import mongoose from "mongoose";

const FlatSchema = new mongoose.Schema({
  // 🔗 Relations
  buildingId: { type: String, required: true },   // e.g. "alaknanda"
  blockId: { type: String, required: true },      // e.g. "A1"
  buildingName: { type: String, required: true }, // e.g. "Alaknanda 1"

  // 🏠 Flat Details
  flatNo: { type: String, required: true },       // e.g. "101"
  bhk: { type: String, required: true },          // e.g. "2BHK"
  area: { type: String },                         // e.g. "1090 sqft"
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  balcony: { type: Number },

  // 💰 Sales Info
  status: { 
    type: String, 
    enum: ["available", "sold"], 
    required: true 
  },
               

  // 📸 Media (Cloudinary URLs)
  images: { type: [String], default: [] },        // array of Cloudinary image URLs

  // ✍️ Digital Signature (One per flat)
  signatureFile: { type: String },                // Cloudinary URL
  signatureDate: { type: Date },                  // when signed
}, { timestamps: true });

export default mongoose.models.Flat || mongoose.model("Flat", FlatSchema);
