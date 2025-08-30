import mongoose from "mongoose";

// 🏠 Flat
const FlatSchema = new mongoose.Schema({
  flatNo: { type: String, required: true }, // "001"
  status: { 
    type: String, 
    enum: ["available", "sold"], 
    required: true 
  },
  bhk: { type: String, required: true }, // e.g. "2BHK", "3BHK"
}, { _id: false });

// 🏢 Block inside a building
const BlockSchema = new mongoose.Schema({
  id: { type: String, required: true },   // e.g. "A1"
  name: { type: String, required: true }, // e.g. "Alaknanda 1"
  flats: { type: [FlatSchema], default: [] },
}, { _id: false });

// 🏬 Building schema
const BuildingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. "alaknanda"
  name: { type: String, required: true },             // e.g. "Alaknanda Towers"
  blocks: { type: [BlockSchema], default: [] },
}, { timestamps: true });

export default mongoose.models.Building ||
mongoose.model("Building", BuildingSchema);
