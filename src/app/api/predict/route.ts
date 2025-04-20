import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const crop = formData.crop;
    const crop_year = formData.crop_year;
    const season = formData.season;
    const state = formData.state;
    const area = formData.area;
    const rainFall = formData.rainFall;
    const pesticide = formData.pesticide;
    const fertilizer = formData.fertilizer;

    const { stdout, stderr } = await execAsync(
      "py -3.12 python/predict.py " +
        `"${crop}" "${crop_year}" "${season}" "${state}" "${area}" "${rainFall}" "${pesticide}" "${fertilizer}"`
    );
    console.log(stdout);
    const result = stdout.trim().split("\n");
    return NextResponse.json(
      {
        yield: result[0],
        production: result[1],
        message: "Prediction Succesfull",
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
