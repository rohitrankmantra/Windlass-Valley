import mongoose from "mongoose";
import XLSX from "xlsx";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

// 1️⃣ MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "realestate",
    });
    console.log("🚀 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

// 2️⃣ Define Schemas
const flatSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

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

const Building =
  mongoose.models.Building || mongoose.model("Building", buildingSchema);
const Flat = mongoose.models.Flat || mongoose.model("Flat", flatSchema);

// 3️⃣ Read Excel
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
}

// 4️⃣ Transform Excel → DB
function transformData(excelData) {
  const buildingsMap = {};
  const flats = [];

  excelData.forEach((row) => {
    // ✅ Mapped to your actual Excel headers
    const project = row["Sub Project"]?.trim();
    const block = row["Sub Project"]?.trim(); // no separate block → use Sub Project
    const unitNo = row["Unit No"];
    const bhk = row["Flat Type"];
    const area = row["Saleable Area Sq Ft."];
    const status =
      row["Status"]?.toLowerCase() === "sold" ? "sold" : "available";

    if (!project || !unitNo) return;

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
        name: project,
        flats: [],
      });
    }

    buildingsMap[buildingId].blocks
      .find((b) => b.id === blockId)
      .flats.push({
        flatNo: String(unitNo),
        status,
        bhk,
      });

    flats.push({
      buildingId,
      blockId,
      buildingName: project,
      flatNo: String(unitNo),
      bhk,
      area: area ? `${area} sqft` : null,
      bedrooms: null,
      bathrooms: null,
      balcony: null,
      status,
      images: [],
      signatureFile: null,
      signatureDate: null,
    });
  });

  return { buildings: Object.values(buildingsMap), flats };
}

// 5️⃣ Import Data
async function importData() {
  await connectDB();

  const excelData = readExcel("./windlass.xlsx");

  console.log("🟢 Excel headers:", Object.keys(excelData[0]));
  console.log("🟢 Sample row:", excelData[0]);

  const { buildings, flats } = transformData(excelData);

  await Building.deleteMany({});
  await Flat.deleteMany({});
  await Building.insertMany(buildings);
  await Flat.insertMany(flats);

  console.log(`✅ Inserted Buildings: ${buildings.length}`);
  console.log(`✅ Inserted Flats: ${flats.length}`);
  console.log("🎉 Data Imported Successfully");

  mongoose.connection.close();
}

importData();
