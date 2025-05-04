import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  const idealTempRange = [20, 30]; // Ideal temperature in Celsius
  const idealHumidityRange = [50, 70]; // Ideal humidity in percentage

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
      temperature,
      humidity,
    } = formData;

    const { stdout } = await execAsync(
      `py -3.12 python/predict.py "${crop}" "${crop_year}" "${season}" "${state}" "${area}" "${rainFall}" "${pesticide}" "${fertilizer}"`
    );
    function getEfficiency(
      value: number,
      idealMin: number,
      idealMax: number
    ): number {
      if (value >= idealMin && value <= idealMax) return 1; // perfect
      const range = idealMax - idealMin;
      const diff = Math.min(
        Math.abs(value - idealMin),
        Math.abs(value - idealMax)
      );
      return Math.max(0.7, 1 - diff / range); // efficiency between 0.7 to 1
    }
    const tempEfficiency = getEfficiency(temperature, 20, 30);
    const humidityEfficiency = getEfficiency(humidity, 50, 70);

    const adjustmentFactor = (tempEfficiency + humidityEfficiency) / 2;

    const result = stdout.trim().split("\n");

    const predictedYield = parseFloat(
      result[result.length - 2]?.split(":").pop()?.trim() || "0"
    );
    const predictedProduction = parseFloat(
      result[result.length - 1]?.split(":").pop()?.trim() || "0"
    );

    if (predictedYield <= 0 || predictedProduction <= 0) {
      return NextResponse.json(
        {
          yield: predictedYield,
          production: predictedProduction * adjustmentFactor,
          message:
            "Prediction resulted in a negative or zero value. Please verify the input values (e.g., area, rainfall, fertilizer, pesticide).",
        },
        { status: 400 }
      );
    }

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
