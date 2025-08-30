import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "✅ MongoDB connection successful" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
