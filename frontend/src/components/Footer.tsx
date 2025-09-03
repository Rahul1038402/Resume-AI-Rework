import { Mail, Github, Linkedin } from 'lucide-react';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import Orb from '@/components/ui/Orb';
import GradientText from './ui/GradientText';
import { DotBackground } from './ui/dotbg';
import IconMarquee from './ui/linksmarquee';

const Footer = () => {

  return (
    <>
      {/* Footer Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-700 relative">
        <DotBackground
          dotSize={2}
          dotColor="#8c8c8c"
          darkDotColor="#404040"
          spacing={60}
          showFade={true}
          fadeIntensity={50}
          className="h-auto min-h-[400px] pt-20 pb-10"
        >
          <div className="container mx-auto px-4 pb-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 ">
              <div>
                <h3 className="text-xl font-bold text-resume-primary dark:text-white mb-4 ml-4">
                  <GradientText
                    colors={["#9BBD67", "#26C168", "#92C8C0", "#4079ff", "#E3F1E8"]}
                    animationSpeed={10}
                    showBorder={false}
                    className="text-4xl font-semibold"
                  >
                    ResumeAI
                  </GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 backdrop-blur-md">
                  AI-powered tools to analyze your resume, create tailored applications, and track every opportunity all in one place.
                </p>
              </div>

              <div className='w-fit h-fit backdrop-blur-md'>
                <h4 className="font-semibold text-xl text-resume-primary dark:text-resume-secondary mb-10">Features</h4>
                <ul className="space-y-6">
                  <li>
                    <Link to="/builder" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors ">Resume Builder</Link>
                  </li>
                  <li>
                    <Link to="/analyzer" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors ">Resume Analyzer</Link>
                  </li>

                  <li>
                    <Link to="/tracker" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors ">Job Tracker</Link>
                  </li>
                </ul>
              </div>

              <div className='w-fit h-fit backdrop-blur-md'>
                <h4 className="font-semibold text-xl text-resume-primary dark:text-resume-secondary mb-10">About Us</h4>
                <ul className="space-y-6">
                  <li>
                    <Link to="/about" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors ">About Resume AI</Link>
                  </li>
                  <li>
                    <Link to="/aboutme" className="text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white transition-colors ">About Me</Link>
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
          </div>
          <h4 className='text-2xl text-center text-resume-primary dark:text-resume-secondary'>My Socials</h4>
          <IconMarquee speed={20} iconSize={30} />
        </DotBackground>
      </div>
    </>
  );
};

export default Footer;