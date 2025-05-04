"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Thank you! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-base-300 h-[calc(100vh-5.6rem)] flex items-center justify-center px-5 py-5">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="/contact-image.png"
          className="max-w-sm rounded-lg shadow-2xl"
          alt="Contact"
        />
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center">Contact Us</h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Message</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Type your message..."
                className="textarea textarea-bordered"
                required
              ></textarea>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
