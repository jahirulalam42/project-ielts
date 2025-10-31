"use client";
import Link from "next/link";
import React from "react";
import {
  FaCheckCircle,
  FaHeadphones,
  FaBookOpen,
  FaPencilAlt,
  FaMicrophone,
  FaChartLine,
  FaUserFriends,
  FaGraduationCap,
  FaChartBar
} from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { IoMdTimer } from "react-icons/io";
import { GiProgression } from "react-icons/gi";

export default function IELTSLandingPage(): any {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Top Navbar */}
      {/* <header className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="navbar py-3">
            <div className="navbar-start">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">I</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-red-700">
                    IELTS Pro
                  </span>
                  <div className="text-xs text-gray-500">
                    Practice • Track • Improve
                  </div>
                </div>
              </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1 gap-1">
                <li>
                  <Link
                    href="#features"
                    className="btn btn-ghost rounded-btn font-medium"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="btn btn-ghost rounded-btn font-medium"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="btn btn-ghost rounded-btn font-medium"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="btn btn-ghost rounded-btn font-medium"
                  >
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>

            <div className="navbar-end flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="btn btn-sm btn-outline btn-neutral hidden sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="btn btn-sm btn-primary bg-red-600 hover:bg-red-700 border-0"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                Prepare with <span className="text-red-600">Confidence</span> —
                <br />
                Master the <span className="text-red-600">IELTS</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Realistic practice tests, detailed analytics, and expert-led
                lessons to boost your Listening, Reading, Writing, and Speaking
                scores. Designed for learners who want a clear, measurable path
                to success.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/test/reading"
                  className="btn btn-primary btn-lg bg-red-600 hover:bg-red-700 border-0"
                >
                  Start a Practice Test
                </Link>
                <Link href="#features" className="btn btn-outline btn-lg">
                  See Features
                </Link>
              </div>

              <div className="stats stats-vertical lg:stats-horizontal gap-2">
                <div className="stat bg-base-200 rounded-lg p-4 text-center">
                  <div className="stat-value text-red-600 text-xl md:text-2xl">
                    98%
                  </div>
                  <div className="stat-desc text-sm">Student satisfaction</div>
                </div>

                <div className="stat bg-base-200 rounded-lg p-4 text-center">
                  <div className="stat-value text-xl md:text-2xl">3×</div>
                  <div className="stat-desc text-sm">Faster improvement</div>
                </div>

                <div className="stat bg-base-200 rounded-lg p-4 text-center">
                  <div className="stat-value text-xl md:text-2xl">
                    4 Sections
                  </div>
                  <div className="stat-desc text-sm">
                    Complete exam coverage
                  </div>
                </div>

                <div className="stat bg-base-200 rounded-lg p-4 text-center">
                  <div className="stat-value text-xl md:text-2xl">24/7</div>
                  <div className="stat-desc text-sm">Practice anytime</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 shadow-2xl max-w-md">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      {
                        icon: <FaHeadphones className="text-white text-3xl" />,
                        label: "Listening",
                      },
                      {
                        icon: <FaBookOpen className="text-white text-3xl" />,
                        label: "Reading",
                      },
                      {
                        icon: <FaPencilAlt className="text-white text-3xl" />,
                        label: "Writing",
                      },
                      {
                        icon: <FaMicrophone className="text-white text-3xl" />,
                        label: "Speaking",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 flex flex-col items-center justify-center"
                      >
                        {item.icon}
                        <h3 className="text-white font-semibold mt-3">
                          {item.label}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Preparation Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to achieve your target band score
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaCheckCircle className="text-red-600 text-2xl" />,
                title: "Realistic Mock Tests",
                desc: "Timed full-length tests that mirror the real exam",
              },
              {
                icon: <FaChartLine className="text-red-600 text-2xl" />,
                title: "Detailed Analytics",
                desc: "Track strengths and weaknesses with visual reports",
              },
              {
                icon: <FaUserFriends className="text-red-600 text-2xl" />,
                title: "Expert Feedback",
                desc: "Personalized evaluations from certified instructors",
              },
              {
                icon: <FaGraduationCap className="text-red-600 text-2xl" />,
                title: "Video Lessons",
                desc: "Comprehensive tutorials for each test section",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-md p-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-base-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative max-w-md">
                <div className="bg-gradient-to-br from-blue-50 to-base-100 rounded-2xl p-8 border border-gray-200 shadow-md">
                  <div className="flex justify-center mb-6">
                    <div className="bg-white border rounded-xl p-6 shadow-md w-full">
                      <div className="flex justify-between items-center mb-4 gap-2">
                        <div className="text-lg font-bold">Progress Report</div>
                        <div className="badge badge-success">Band 7.5</div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Listening</span>
                            <span>8.0</span>
                          </div>
                          <progress
                            className="progress progress-success w-full"
                            value="80"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Reading</span>
                            <span>7.5</span>
                          </div>
                          <progress
                            className="progress progress-primary w-full"
                            value="75"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Writing</span>
                            <span>6.5</span>
                          </div>
                          <progress
                            className="progress progress-warning w-full"
                            value="65"
                            max="100"
                          ></progress>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Speaking</span>
                            <span>7.0</span>
                          </div>
                          <progress
                            className="progress progress-info w-full"
                            value="70"
                            max="100"
                          ></progress>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-gray-600 text-sm">
                    Track your progress with detailed analytics
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">How it works</h3>
              <p className="text-lg text-gray-600 mb-6">
                A simple three-step path to improve your band score.
              </p>

              <ol className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Take a diagnostic test",
                    desc: "Understand your baseline with a full-length mock exam",
                  },
                  {
                    step: "2",
                    title: "Study focused lessons",
                    desc: "Targeted exercises and model answers to close gaps",
                  },
                  {
                    step: "3",
                    title: "Track progress & retake",
                    desc: "Charts show improvements and guide your next steps",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-lg font-bold">
                        {item.step}
                      </div>
                      {index < 2 && (
                        <div className="w-1 h-full bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8">
                <Link href="#pricing" className="btn btn-outline btn-lg">
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New How It Works - 4 Step Process */}
      <section id="how-it-works-new" className="py-16 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works - 4 Step Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your complete journey to IELTS success in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                step: "1",
                icon: <TbTargetArrow className="text-blue-600 text-2xl" />,
                title: "Choose a Module",
                desc: "Select from Listening, Reading, Writing, or Speaking. Each module mirrors the real IELTS exam format.",
                color: "bg-blue-50"
              },
              {
                step: "2",
                icon: <IoMdTimer className="text-green-600 text-2xl" />,
                title: "Take the Test",
                desc: "Experience the real exam interface with built-in timers, progress tracking, and interactive questions.",
                color: "bg-green-50"
              },
              {
                step: "3",
                icon: <FaChartBar className="text-purple-600 text-2xl" />,
                title: "Track Your Progress",
                desc: "Review your answers, listen to speaking recordings, and analyze detailed performance reports.",
                color: "bg-purple-50"
              },
              {
                step: "4",
                icon: <GiProgression className="text-orange-600 text-2xl" />,
                title: "Improve Over Time",
                desc: "Self-evaluate your performance, identify weak areas, and watch your band score improve.",
                color: "bg-orange-50"
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-3 z-10">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                </div>
                
                {/* Main Card */}
                <div className="card bg-base-100 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                
                {/* Connecting Arrow */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-black to-transparent">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100 max-w-4xl mx-auto">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your IELTS Journey?</h4>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of successful test-takers who have improved their band scores with our comprehensive practice platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/test/reading"
                  className="btn btn-primary btn-lg bg-red-600 hover:bg-red-700 border-0"
                >
                  Start Free Test
                </Link>
                <Link
                  href="/user/signup"
                  className="btn btn-outline btn-lg"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Flexible options to fit your study needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "Free",
                period: "Forever",
                features: [
                  "2 practice tests",
                  "Basic analytics",
                  "Limited feedback",
                  "Community support",
                ],
                highlight: false,
              },
              {
                name: "Premium",
                price: "$19",
                period: "per month",
                features: [
                  "Unlimited tests",
                  "Advanced analytics",
                  "Expert feedback",
                  "Video lessons",
                  "Priority support",
                ],
                highlight: true,
              },
              {
                name: "Intensive",
                price: "$149",
                period: "for 6 months",
                features: [
                  "All Premium features",
                  "1-on-1 coaching",
                  "Score guarantee",
                  "Study planner",
                  "24/7 support",
                ],
                highlight: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`card rounded-xl overflow-hidden ${
                  plan.highlight
                    ? "ring-2 ring-red-600 transform -translate-y-2 shadow-xl"
                    : "shadow-md"
                }`}
              >
                <div
                  className={`p-6 ${
                    plan.highlight ? "bg-red-600 text-white" : "bg-base-100"
                  }`}
                >
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                </div>
                <div className="card-body bg-base-100">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <div className="text-green-500 mr-2 mt-1">✓</div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn btn-block ${
                      plan.highlight
                        ? "btn-primary bg-red-600 hover:bg-red-700 border-0"
                        : "btn-outline"
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-base-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from students who achieved their dream scores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah K.",
                score: "7.5",
                text: "The practice tests mirrored the actual exam perfectly. I improved my writing score by 1.5 bands!",
              },
              {
                name: "David M.",
                score: "8.0",
                text: "The personalized feedback on my speaking practice was invaluable. I finally overcame my hesitation.",
              },
              {
                name: "Priya T.",
                score: "8.5",
                text: "The vocabulary builder helped me tremendously in the reading section. Highly recommended!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="card bg-base-200 border border-gray-200"
              >
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="avatar placeholder">
                      <div className="bg-red-100 text-red-800 rounded-full w-12">
                        <span className="text-lg font-bold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <div className="badge badge-primary bg-red-600 border-0 text-white">
                        Band {testimonial.score}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Achieve Your IELTS Goals?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful test-takers and start your journey to a
            higher band score today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/signup"
              className="btn btn-primary btn-lg bg-white text-red-700 hover:bg-gray-100 border-0"
            >
              Start 7-Day Free Trial
            </Link>
            <Link
              href="#features"
              className="btn btn-outline btn-lg text-white hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-base-200 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">I</span>
                </div>
                <div>
                  <div className="font-bold text-lg">IELTS Pro</div>
                  <div className="text-sm text-gray-600">
                    Practice • Track • Improve
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Professional IELTS preparation for ambitious test-takers
                worldwide.
              </p>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="btn btn-circle btn-sm bg-base-300 border-0"
                  >
                    <span className="text-gray-600">f{i}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                {[
                  "Study Guides",
                  "Practice Tests",
                  "Vocabulary Lists",
                  "Writing Samples",
                  "Speaking Tips",
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "Careers",
                  "Contact",
                  "Blog",
                  "Success Stories",
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">📍</span>
                  <span>123 Education Street, London, UK</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📞</span>
                  <span>+44 20 7123 4567</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✉️</span>
                  <span>support@ieltsprep.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} IELTS Pro. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
