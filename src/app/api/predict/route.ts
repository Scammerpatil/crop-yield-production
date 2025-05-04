import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const {
      crop,
      crop_year,
      season,
      state,
      area,
      rainFall,
      pesticide,
      fertilizer,
    } = formData;

    const { stdout } = await execAsync(
      `py -3.12 python/predict.py "${crop}" "${crop_year}" "${season}" "${state}" "${area}" "${rainFall}" "${pesticide}" "${fertilizer}"`
    );

    const result = stdout.trim().split("\n");

    const predictedYield = parseFloat(
      result[result.length - 2]?.split(":").pop()?.trim() || "0"
    );
    const predictedProduction = parseFloat(
      result[result.length - 1]?.split(":").pop()?.trim() || "0"
    );

    // 🛑 Handle invalid predictions
    if (predictedYield <= 0 || predictedProduction <= 0) {
      return NextResponse.json(
        {
          yield: predictedYield,
          production: predictedProduction,
          message:
            "Prediction resulted in a negative or zero value. Please verify the input values (e.g., area, rainfall, fertilizer, pesticide).",
        },
        { status: 400 }
      );
    }

    // ✅ Return success if valid
    return NextResponse.json(
      {
        yield: predictedYield,
        production: predictedProduction,
        message: "Prediction Successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
