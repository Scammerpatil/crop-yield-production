"use client";
import { CROP_TYPES, DISTRICTS, STATES } from "@/utils/Constant";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const PredictPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [data, setData] = useState({
    yield: 0,
    production: 0,
    message: "",
  });
  const [formData, setFormData] = useState({
    crop: "",
    crop_year: "",
    season: "",
    state: "",
    district: "",
    temperature: "",
    humidity: "",
    area: "",
    rainFall: "",
    pesticide: "",
    fertilizer: "",
  });

  const handleSubmit = async () => {
    if (
      !formData.crop ||
      !formData.crop_year ||
      !formData.season ||
      !formData.state ||
      !formData.area ||
      !formData.rainFall ||
      !formData.pesticide ||
      !formData.temperature ||
      !formData.humidity
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const response = axios.post("/api/predict", { formData });
      toast.promise(response, {
        loading: "Crop Yield Predicting...",
        success: (data) => {
          setData(data.data);
          return data.data.message;
        },
        error: (err: any) => {
          console.log(err);
          return err.response?.data?.message || "Error prediciting crop yield";
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to predict crop yield");
    }
  };

  const handleFetchWeatherData = async () => {
    if (!formData.state || !formData.district) {
      toast.error("Please select state and district");
      return;
    }
    try {
      toast.loading("Fetching weather data...");
      const geoResponse: AxiosResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${formData.district},${formData.state},IN&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
      );

      if (geoResponse.data.length === 0) {
        toast.error("Invalid state or district");
        return;
      }

      const { lat, lon } = geoResponse.data[0];
      const weatherResponse: AxiosResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
      );

      const { main } = weatherResponse.data;

      setFormData({
        ...formData,
        temperature: main.temp,
        humidity: main.humidity,
      });
      toast.dismiss();
      toast.success("Weather data fetched successfully!");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Failed to fetch weather data");
    }
  };

  return (
    <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 min-h-[calc(100vh-5.6rem)]">
      <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
          <img src="login.png" alt="login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 flex flex-col items-center justify-center md:p-10 md:py-0">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Predict Crop Yield
          </h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <select
                className="select select-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.crop}
                onChange={(e) => {
                  setFormData({ ...formData, crop: e.target.value });
                }}
              >
                <option defaultChecked>Select Crop</option>
                {CROP_TYPES.map((crop, index) => (
                  <option key={index} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Crop Year (YYYY)"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.crop_year}
                onChange={(e) => {
                  setFormData({ ...formData, crop_year: e.target.value });
                }}
              />

              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between items-center">
                <select
                  className="select select-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                  }}
                >
                  <option defaultChecked>Select State</option>
                  {STATES.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <select
                  className="select select-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.district}
                  onChange={(e) => {
                    setFormData({ ...formData, district: e.target.value });
                  }}
                >
                  <option defaultChecked>Select District</option>
                  {formData.state &&
                    DISTRICTS[formData.state as keyof typeof DISTRICTS].map(
                      (district: string, index: number) => (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      )
                    )}
                </select>
                <button
                  className="btn btn-outline btn-primary"
                  onClick={handleFetchWeatherData}
                  disabled={!formData.district || !formData.state}
                >
                  Fetch Weather Data
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between items-center">
                <input
                  type="text"
                  placeholder="Temperature (in °C)"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  readOnly
                  value={formData.temperature + "°C"}
                />

                <input
                  type="text"
                  placeholder="Humidity (%)"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  readOnly
                  value={formData.humidity + "%"}
                />
              </div>

              <select
                className="select select-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.season}
                onChange={(e) => {
                  setFormData({ ...formData, season: e.target.value });
                }}
              >
                <option defaultChecked>Select Season</option>
                {[
                  "Whole Year",
                  "Kharif",
                  "Rabi",
                  "Autumn",
                  "Summer",
                  "Winter",
                ].map((season, index) => (
                  <option key={index} value={season}>
                    {season}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Rainfall (in mm)"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.rainFall}
                onChange={(e) => {
                  setFormData({ ...formData, rainFall: e.target.value });
                }}
              />

              <input
                type="text"
                placeholder="Area (in acres)"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.area}
                onChange={(e) => {
                  setFormData({ ...formData, area: e.target.value });
                }}
              />

              <input
                type="text"
                placeholder="Pesticide (in kg/ha)"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.pesticide}
                onChange={(e) => {
                  setFormData({ ...formData, pesticide: e.target.value });
                }}
              />

              <input
                type="text"
                placeholder="Fertilizer (in kg/ha)"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.fertilizer}
                onChange={(e) => {
                  setFormData({ ...formData, fertilizer: e.target.value });
                }}
              />

              <div className="flex items-center gap-1.5  justify-start pl-2">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => {
                        setDisabled(!disabled);
                      }}
                    />
                  </label>
                </div>
                <h3 className="flex items-center whitespace-nowrap text-base text-base-content">
                  I agree to the
                  <span className="text-primary">&nbsp;Terms</span>
                  &nbsp;and
                  <span className="text-primary">&nbsp;Privacy Policy</span>.
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  Predict Yield
                </button>
              </div>
              <div className="flex flex-col gap-2 justify-center items-center">
                {data.yield !== 0 && (
                  <div className="alert alert-success shadow-lg w-full max-w-[300px] flex flex-col gap-2 justify-center items-center">
                    <span className="text-xl font-semibold text-success-content text-center">
                      Predicted Yield: {(data.yield / 10).toFixed(2)} ton/acre
                    </span>
                    {/* <span className="text-xl font-semibold text-success-content text-center">
                      Predicted Production: {data.production} Q
                    </span> */}
                    {data.message && (
                      <span className="text-sm font-semibold text-success-content text-center">
                        {data.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictPage;
