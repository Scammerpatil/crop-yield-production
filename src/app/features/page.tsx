const features = [
  {
    title: "AI-Powered Yield Forecasting",
    desc: "Uses real-time data and ML models to give precise yield per hectare.",
    icon: "🌾",
  },
  {
    title: "Production Estimation",
    desc: "Calculates total production based on area and crop parameters.",
    icon: "📊",
  },
  {
    title: "Real-Time Feedback",
    desc: "Get instant results without any waiting — all on your browser.",
    icon: "⚡",
  },
  {
    title: "User Friendly UI",
    desc: "Beautiful, minimal, and clean interface using TailwindCSS & DaisyUI.",
    icon: "🎨",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-base-300 h-[calc(100vh-5.6rem)] flex items-center justify-center flex-col px-5 py-5">
      <h1 className="text-4xl font-bold mb-8 text-center">Key Features</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="card bg-base-100 shadow-xl border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl">
                {f.icon} {f.title}
              </h2>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
