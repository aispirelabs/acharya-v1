import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-800 pt-10 pb-4 mt-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-8 border-b border-gray-200">
          {/* Brand/Logo */}
          <div className="flex flex-col items-center md:items-start gap-3 md:w-1/4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold gradient-text">AcharyaAI</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-xs mt-2">
              Transforming education through AI-powered learning experiences. Master new skills with personalized courses and interactive assessments.
            </p>
          </div>

          {/* Quick Links & Legal */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-center md:text-left md:w-2/4 justify-center">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className="hover:underline text-gray-700 hover:text-primary-600">Courses</Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline text-gray-700 hover:text-primary-600">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline text-gray-700 hover:text-primary-600">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:underline text-gray-700 hover:text-primary-600">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline text-gray-700 hover:text-primary-600">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col items-center md:items-end gap-3 md:w-1/4">
            <h4 className="font-semibold mb-3 text-gray-900">Connect</h4>
            <div className="flex gap-4">
              <Link href="https://github.com/getFrontend" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                <Github size={28} className="text-gray-600 hover:text-[#1da1f2] transition-colors" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={28} className="text-gray-600 hover:text-[#1da1f2] transition-colors" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={28} className="text-gray-600 hover:text-[#0077b5] transition-colors" />
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm pt-6">
          © {currentYear} AcharyaAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;