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
        <div className="relative overflow-hidden">
            {/* Gradient Border Bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent_0%,rgba(203,213,225,0.5)_20%,rgba(203,213,225,1)_50%,rgba(203,213,225,0.5)_80%,transparent_100%)]
    dark:bg-[linear-gradient(to_right,transparent_0%,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.6)_50%,rgba(100,116,139,0.3)_80%,transparent_100%)]"
            />
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
            <motion.div
                className="mx-auto px-4 sm:pt-10 pb-20"
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
                            className="text-2xl mb-6 mt-8 tracking-wide"
                            variants={itemVariants}
                        >
                            Don't just send resumes. Build one in minutes,
                            get AI-powered feedback to optimize it,
                            and track every job application in one dashboard.
                        </motion.p>
                    </div>

                    {/* Feature Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4"
                        variants={itemVariants}
                    >
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900 px-8 py-6 text-lg"
                            asChild
                        >
                            <Link to="/builder">
                                <ShinyText text="Build a Resume" disabled={false} speed={5} className="custom-class" />
                            </Link>
                        </Button>

                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900 px-8 py-6 text-lg"
                            asChild
                        >
                            <Link to="/analyzer">
                                <ShinyText text="Analyze Resume" disabled={false} speed={5} className="custom-class" />
                            </Link>
                        </Button>

                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900 px-8 py-6 text-lg"
                            asChild
                        >
                            <Link to="/tracker">
                                <ShinyText text="Track Applications" disabled={false} speed={5} className="custom-class" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default HeroSection;
