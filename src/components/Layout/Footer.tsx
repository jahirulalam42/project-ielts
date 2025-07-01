import React from "react";

const Footer = () => {
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
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="font-bold">I</span>
              </div>
              <span className="text-xl font-bold">IELTS Master</span>
            </div>
            <p className="mt-4 text-gray-400 max-w-xs">
              Premium IELTS preparation resources and practice tests for
              academic and general training.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a href="#" className="text-gray-400 hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>© 2025 IELTS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
