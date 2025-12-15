import React from 'react'
import Aurora from '../../components/ui/Aurora'
import GradientText from '../../components/ui/GradientText'
import { Button } from '../../components/ui/button'
import { Link } from 'react-router-dom'
import ShinyText from '../../components/ui/ShinyText'
import { motion, Variants } from 'framer-motion'

const HeroSection = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.6, 0.05, 0.01, 0.9]
            }
        }
    }

    return (
        <>
        <div className="h-56">
            <Aurora
                colorStops={["#7CFF67", "#b19eef", "#5227ff"]}
                blend={0.5}
                amplitude={2.0}
                speed={1.0}
            />
            </div>
            <div className="relative overflow-hidden">
                
                {/* Gradient Border Bottom */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent_0%,rgba(203,213,225,0.5)_20%,rgba(203,213,225,1)_50%,rgba(203,213,225,0.5)_80%,transparent_100%)]
    dark:bg-[linear-gradient(to_right,transparent_0%,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.6)_50%,rgba(100,116,139,0.3)_80%,transparent_100%)]"
                />
                <motion.div
                    className="mx-auto px-4 pb-20"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="mb-6 size-full flex flex-col justify-center items-center">
                            <motion.div variants={itemVariants}>
                                <GradientText
                                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                                    animationSpeed={11}
                                    showBorder={false}
                                    className="text-5xl"
                                >
                                    <p className="mb-5">
                                        Land Your Dream Job with AI-Powered Resume Tools
                                    </p>
                                </GradientText>
                            </motion.div>

                    <motion.p
                        className="text-xl md:text-2xl mb-4 text-gray-700 dark:text-gray-300 tracking-wide"
                        variants={itemVariants}
                    >
                        Built by a developer who landed a US remote internship using this exact tool. Now it's your turn.
                    </motion.p>

                    <motion.p
                        className="text-lg mb-10 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        variants={itemVariants}
                    >
                        Build professional resumes in minutes, get AI-powered feedback to optimize them, and track every job application in one dashboard.
                    </motion.p>
                        </div>

                        {/* Feature Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row justify-center gap-4"
                            variants={itemVariants}
                        >
                            <button
                                className="dark:bg-transparent rounded-lg border bg-resume-primary hover:bg-resume-primary/90 hover:dark:bg-gray-900/80 dark:border-gray-700 px-4 h-[60px] font-medium cursor-pointer transition-all duration-300"
                            >
                                <Link to="/builder">
                                    <ShinyText text="Build a Resume" disabled={false} speed={5} className="text-lg" />
                                </Link>
                            </button>

                            <button
                                className="dark:bg-transparent rounded-lg border bg-resume-primary hover:bg-resume-primary/90 hover:dark:bg-gray-900/80 dark:border-gray-700 px-4 h-[60px] font-medium cursor-pointer transition-all duration-300"
                            >
                                <Link to="/analyzer">
                                    <ShinyText text="Analyze Resume" disabled={false} speed={5} className="text-lg" />
                                </Link>
                            </button>

                            <button
                                className="dark:bg-transparent rounded-lg border bg-resume-primary hover:bg-resume-primary/90 hover:dark:bg-gray-900/80 dark:border-gray-700 px-4 h-[60px] font-medium cursor-pointer transition-all duration-300"
                            >
                                <Link to="/tracker">
                                    <ShinyText text="Track Applications" disabled={false} speed={5} className="text-lg" />
                                </Link>
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default HeroSection;
