import mongoose from "mongoose";
import * as XLSX from "xlsx";
import { connectDB } from "../src/lib/mongodb.js";

// 1️⃣ Connect to MongoDB
async function connect() {
  await connectDB(); // ✅ uses your existing connection logic
}

// 2️⃣ Define Schemas (same as before)
const flatSchema = new mongoose.Schema({
  buildingId: String,
  blockId: String,
  buildingName: String,

  flatNo: { type: String, required: true },
  bhk: { type: String, required: true },
  area: String,
  bedrooms: Number,
  bathrooms: Number,
  balcony: Number,

  status: { type: String, enum: ["available", "sold"], required: true },

  images: { type: [String], default: [] },
  signatureFile: { type: String },
  signatureDate: { type: Date },
}, { timestamps: true });

const blockSchema = new mongoose.Schema({
  id: String,
  name: String,
  flats: [{ flatNo: String, status: String, bhk: String }],
});

const buildingSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: { type: String, default: "residential" },
  blocks: [blockSchema],
});

const Building = mongoose.models.Building || mongoose.model("Building", buildingSchema);
const Flat = mongoose.models.Flat || mongoose.model("Flat", flatSchema);

// 3️⃣ Excel → JSON
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
}

// 4️⃣ Transform Excel → DB structure
function transformData(excelData) {
  const buildingsMap = {};
  const flats = [];

  excelData.forEach((row) => {
    const project = row["Project"]?.trim();
    const block = row["Block"]?.trim();
    const unitNo = row["Unit No"];
    const bhk = row["BHK"];
    const area = row["Saleable Area Sq Ft."];
    const status = row["Status"];
    const bedrooms = row["Bedrooms"];
    const bathrooms = row["Bathrooms"];
    const balcony = row["Balcony"];
    const images = row["Images"] ? row["Images"].split(",") : [];
    const signatureFile = row["Signature File"];
    const signatureDate = row["Signature Date"] ? new Date(row["Signature Date"]) : null;

    if (!project || !block || !unitNo) return;

    const buildingId = project.toLowerCase().replace(/\s+/g, "");
    const blockId = block;

    if (!buildingsMap[buildingId]) {
      buildingsMap[buildingId] = {
        id: buildingId,
        name: project,
        type: "residential",
        blocks: [],
      };
    }
    if (!buildingsMap[buildingId].blocks.find((b) => b.id === blockId)) {
      buildingsMap[buildingId].blocks.push({
        id: blockId,
        name: `${project} ${block}`,
        flats: [],
      });
    }

    buildingsMap[buildingId].blocks
      .find((b) => b.id === blockId)
      .flats.push({
        flatNo: String(unitNo),
        status: status || "available",
        bhk,
      });

    flats.push({
      buildingId,
      blockId,
      buildingName: `${project} ${block}`,
      flatNo: String(unitNo),
      bhk,
      area: area ? `${area} sqft` : null,
      bedrooms,
      bathrooms,
      balcony,
      status: status || "available",
      images,
      signatureFile,
      signatureDate,
    });
  });

  return { buildings: Object.values(buildingsMap), flats };
}

// 5️⃣ Import Data
async function importData() {
  await connect();

  const excelData = readExcel("./windlass.xlsx");
  const { buildings, flats } = transformData(excelData);

  await Building.deleteMany({});
  await Flat.deleteMany({});
  await Building.insertMany(buildings);
  await Flat.insertMany(flats);

  console.log("🎉 Data Imported Successfully");
  mongoose.connection.close();
}

importData();
