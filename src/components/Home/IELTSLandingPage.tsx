// components/IELTSLandingPage.tsx
import React from "react";

const IELTSLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Navigation */}
      {/* <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="text-2xl font-bold text-red-800 tracking-tight">
              IELTS MASTERY
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-red-700 font-medium hover:text-red-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#modules"
              className="text-gray-700 font-medium hover:text-red-700 transition-colors"
            >
              Test Modules
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 font-medium hover:text-red-700 transition-colors"
            >
              Success Stories
            </a>
            <a
              href="#faq"
              className="text-gray-700 font-medium hover:text-red-700 transition-colors"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-red-700 font-medium hover:text-red-900 transition-colors">
              Sign In
            </button>
            <button className="btn bg-red-600 text-white hover:bg-red-700 px-5 py-2 rounded-lg transition-colors shadow-md">
              Get Started
            </button>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full mb-4 font-medium">
            Trusted by 50,000+ Students
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Achieve Your <span className="text-red-600">IELTS</span> Dream Score
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-lg">
            Authentic practice tests, personalized feedback, and proven
            strategies to help you excel in your IELTS exam.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="btn bg-red-600 text-white px-8 py-4 hover:bg-red-700 shadow-lg transition-all rounded-lg font-medium">
              Start Free Practice Test
            </button>
            <button className="btn border-2 border-red-600 text-red-600 px-8 py-4 hover:bg-red-50 rounded-lg">
              How It Works
            </button>
          </div>

          <div className="mt-12 bg-white p-6 rounded-xl shadow-md border border-red-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Quick Access to Test Sections
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["listening", "reading", "writing", "speaking"].map(
                (section) => (
                  <a
                    key={section}
                    href={`#${section}`}
                    className="btn bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center py-3 rounded-lg transition-colors"
                  >
                    <span className="capitalize font-medium">{section}</span>
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="w-80 h-80 bg-red-500 rounded-full absolute -top-6 -left-6 opacity-10"></div>
            <div className="card w-96 bg-white shadow-xl border border-red-100 transform transition-transform hover:scale-[1.02]">
              <figure className="px-10 pt-10">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 w-full">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-700">
                            7.5
                          </div>
                          <div className="text-gray-600 mt-2">Band Score</div>
                        </div>
                      </div>
                      <svg width="200" height="200" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#fee2e2"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset="42.45" // 85% of 283
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-red-700">
                  Take a Diagnostic Test
                </h2>
                <p className="text-gray-600">
                  Get your predicted band score in just 30 minutes
                </p>
                <div className="card-actions mt-4">
                  <button className="btn bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
                    Start Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Modules Section */}
      <section id="modules" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Comprehensive Test Modules
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              Master each IELTS section with realistic simulations and expert
              guidance
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testModules.map((module, index) => (
              <div
                key={index}
                id={module.id}
                className="card bg-white shadow-lg border border-red-100 hover:shadow-xl transition-all rounded-xl overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <div className="card-body items-center text-center pt-10">
                  <div
                    className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${module.color}`}
                  >
                    {module.icon}
                  </div>
                  <h3 className="card-title text-xl text-gray-800">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-gray-700">{module.description}</p>
                  <div className="mt-6 w-full">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Duration</span>
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Questions</span>
                      <span>{module.questions}</span>
                    </div>
                  </div>
                  <div className="card-actions mt-6 w-full">
                    <button className="btn w-full bg-red-600 text-white hover:bg-red-700 py-3 rounded-lg">
                      Start {module.title}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 bg-gradient-to-r from-red-50 to-orange-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Why Choose IELTS Mastery
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              Everything you need for IELTS success in one platform
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-red-100"
              >
                <div
                  className={`w-12 h-12 rounded-lg mb-6 flex items-center justify-center ${
                    index === 0
                      ? "bg-red-100"
                      : index === 1
                      ? "bg-orange-100"
                      : "bg-amber-100"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              Hear from students who achieved their target scores
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg border border-red-100 rounded-xl"
              >
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <img src={testimonial.avatar} alt="avatar" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-red-700 font-medium">
                        {testimonial.score}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to achieve your IELTS goals?
          </h2>
          <p className="mt-4 text-xl text-red-100 max-w-2xl mx-auto">
            Join thousands of successful test-takers who've improved their
            scores with our platform
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="btn bg-white text-red-600 px-10 py-4 hover:bg-red-50 shadow-lg font-bold rounded-lg">
              Start Free Practice Test
            </button>
            <button className="btn border-2 border-white text-red-600 hover:bg-white/10 hover:text-white px-10 py-4 rounded-lg">
              View Pricing Plans
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              Everything you need to know about our IELTS preparation platform
            </p>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="collapse collapse-arrow border border-gray-200 mb-4 rounded-lg"
              >
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-xl font-medium text-gray-800">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Test Modules Data
const testModules = [
  {
    id: "listening",
    title: "Listening",
    description: "Practice with authentic recordings and various accents",
    duration: "30 minutes",
    questions: "40 questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-11.314a5 5 0 00-1.414 1.414"
        />
      </svg>
    ),
    color: "bg-red-100",
  },
  {
    id: "reading",
    title: "Reading",
    description: "Improve comprehension with academic and general texts",
    duration: "60 minutes",
    questions: "40 questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    color: "bg-red-100",
  },
  {
    id: "writing",
    title: "Writing",
    description: "Develop skills for both Task 1 and Task 2 responses",
    duration: "60 minutes",
    questions: "2 tasks",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    color: "bg-red-100",
  },
  {
    id: "speaking",
    title: "Speaking",
    description: "Practice with AI feedback and mock interviews",
    duration: "11-14 minutes",
    questions: "3 parts",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    ),
    color: "bg-red-100",
  },
];

// Features Data
const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    title: "Authentic Test Simulations",
    description:
      "IELTS-accurate practice tests that mirror the actual exam format and difficulty level.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-orange-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Detailed Performance Analytics",
    description:
      "Get actionable insights into your strengths and weaknesses with comprehensive reports.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-amber-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Expert Examiner Feedback",
    description:
      "Receive personalized evaluation from certified IELTS examiners.",
  },
];

// Testimonials Data
const testimonials = [
  {
    name: "Sarah Johnson",
    score: "Scored 8.0 Overall",
    quote:
      "The practice tests were incredibly realistic. I felt fully prepared on exam day thanks to this platform!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    name: "David Chen",
    score: "Scored 7.5 Overall",
    quote:
      "The detailed feedback on my writing tasks helped me improve from 6.5 to 7.0 in just two weeks!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    name: "Maria Rodriguez",
    score: "Scored 8.5 Overall",
    quote:
      "The speaking practice with AI feedback was revolutionary. I finally overcame my nervousness.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
];

// FAQ Data
const faqs = [
  {
    question: "How accurate are the practice tests?",
    answer:
      "Our practice tests are developed by IELTS experts and former examiners to precisely match the format, difficulty level, and question types of the actual IELTS exam.",
  },
  {
    question: "Can I get feedback on my writing and speaking?",
    answer:
      "Yes! Our premium plans include detailed feedback from certified IELTS instructors for both writing tasks and speaking practice sessions.",
  },
  {
    question: "How long does it take to see improvement?",
    answer:
      "Most students see significant improvement within 4-6 weeks of regular practice. We recommend practicing at least 30 minutes per day for best results.",
  },
  {
    question: "Do you offer academic and general training?",
    answer:
      "Yes, we provide preparation materials for both IELTS Academic and IELTS General Training modules.",
  },
];

export default IELTSLandingPage;
