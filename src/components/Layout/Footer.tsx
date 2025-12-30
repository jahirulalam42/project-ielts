"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const pathName = usePathname();

  // Footer links data
  const footerLinks = [
    {
      title: "Products",
      links: [
        "Practice Tests",
        "Scoring System",
        "Study Materials",
        "Premium Features",
      ],
    },
    {
      title: "Resources",
      links: [
        "IELTS Guide",
        "Tips & Strategies",
        "Vocabulary Builder",
        "Sample Answers",
      ],
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Testimonials", "Careers"],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: "#" },
    { icon: <FaTwitter />, url: "#" },
    { icon: <FaLinkedin />, url: "#" },
    { icon: <FaInstagram />, url: "#" },
  ];

  // const contactInfo = [
  //   {
  //     icon: <FaMapMarkerAlt className="text-red-600" />,
  //     text: "123 Education Street, London, UK",
  //   },
  //   { icon: <FaPhone className="text-red-600" />, text: "+44 20 7123 4567" },
  //   {
  //     icon: <FaEnvelope className="text-red-600" />,
  //     text: "support@ieltsmaster.com",
  //   },
  // ];

  return (
    !pathName.startsWith("/test/reading/") &&
    !pathName.startsWith("/test/writing/") &&
    !pathName.startsWith("/test/listening/") &&
    !pathName.startsWith("/admin") &&
    !pathName.startsWith("/user/") && (
      <footer className="bg-gray-200 text-gray-700 pt-16 pb-8 border-t border-gray-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    IELTS Master
                  </span>
                  <div className="text-xs text-gray-500">
                    Practice • Track • Improve
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6 max-w-xs">
                Premium IELTS preparation resources and practice tests for
                academic and general training.
              </p>

              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links sections */}
            {footerLinks.map((section, index) => (
              <div key={index} className="mb-6 md:mb-0">
                <h4 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact section */}
            {/* <div>
              <h4 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">
                Contact
              </h4>
              <ul className="space-y-3">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mt-1 mr-3">{item.icon}</span>
                    <span className="text-gray-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>

          {/* Copyright and legal */}
          <div className="pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} IELTS Master. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-red-600 text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="text-gray-600 hover:text-red-600 text-sm transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/cookie-policy"
                  className="text-gray-600 hover:text-red-600 text-sm transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
