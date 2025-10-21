import { Link } from "react-router-dom";
import Orb from '@/components/ui/Orb';
import GradientText from './ui/GradientText';

const Footer = () => {
  return (
    <>
      {/* Footer Navigation */}
      <div className="relative w-full border-t border-gray-300 dark:border-gray-700 bg-gradient-to-t from-white/95 via-white/70 to-white/0 dark:from-black/95 dark:via-black/70 dark:to-black/0 backdrop-blur-sm">
        <div className="flex flex-col justify-center items-center container mx-auto px-4 pb-8 relative pt-6">
          <div className="flex items-center gap-2 pb-6">
            <Link to="/" className="font-bold text-resume-primary dark:text-white relative z-50">
              <GradientText
                colors={["#9BBD67", "#26C168", "#92C8C0", "#4079ff", "#E3F1E8"]}
                animationSpeed={10}
                showBorder={false}
                className="text-3xl"
              >
                ResumeAI
              </GradientText>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className='w-fit h-fit backdrop-blur-md'>
              <h4 className="font-semibold text-xl text-resume-primary dark:text-resume-secondary mb-10">Features</h4>
              <ul className="space-y-6">
                <li>
                  <Link to="/builder" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors">Resume Builder</Link>
                </li>
                <li>
                  <Link to="/analyzer" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors">Resume Analyzer</Link>
                </li>
                <li>
                  <Link to="/tracker" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors">Job Tracker</Link>
                </li>
              </ul>
            </div>

            <div className='w-fit h-fit backdrop-blur-md'>
              <h4 className="font-semibold text-xl text-resume-primary dark:text-resume-secondary mb-10">About Us</h4>
              <ul className="space-y-6">
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors">About Resume AI</Link>
                </li>
                <li>
                  <Link to="/aboutme" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors">About Me</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors">Terms of Service</Link>
                </li>
              </ul>
            </div>
            <Orb
              hoverIntensity={0.75}
              rotateOnHover={true}
              hue={10}
              forceHoverState={false}
            />
          </div>

          {/* Copyright Section */}
          <div className="w-full border-t border-gray-300 dark:border-gray-700 pt-6">
            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Resume AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
