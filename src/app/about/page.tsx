import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-base-300 h-[calc(100vh-5.6rem)] flex items-center justify-center px-5 py-5">
      <div className="hero bg-base-200 rounded-xl shadow-md">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src="/about-agriculture.png"
            alt="Agriculture"
            width={500}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold">About Our Mission</h1>
            <p className="py-6 text-lg">
              We are on a mission to empower Indian agriculture with AI-driven
              insights. Our platform predicts crop yield and production using
              environmental and crop factors — helping farmers make smarter
              decisions.
            </p>
            <p className="text-md text-base-content/70">
              Our AI model is trained on extensive datasets, ensuring accurate
              From farmers to agri-researchers, our tool provides accurate and
              instant forecasts that reduce risk and maximize returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
