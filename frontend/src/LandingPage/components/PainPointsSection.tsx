import { X, CheckCircle2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

const PainPointsSection = () => {

    const painPoints = [
        {
            problem: "Spending hours crafting resumes manually",
            solution: "Build professional resumes in minutes with ATS friendly templates",
        },
        {
            problem: "Resumes getting rejected by ATS systems",
            solution: "Get instant ATS compatibility scores and optimization suggestions",
        },
        {
            problem: "No idea which keywords to include",
            solution: "AI analyzes job descriptions and suggests relevant keywords automatically",
        },
        {
            problem: "Losing track of job applications across platforms",
            solution: "Track all applications in one dashboard with status updates and reminders",
        },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            }
        }
    }

    const cardVariantsLeft: Variants = {
        hidden: { opacity: 0, y: 50, rotate: -2 },
        visible: {
            opacity: 1,
            y: 0,
            rotate: -2,
            transition: {
                duration: 0.6,
                ease: [0.6, 0.05, 0.01, 0.9]
            }
        }
    }

    const cardVariantsRight: Variants = {
        hidden: { opacity: 0, y: 50, rotate: 2 },
        visible: {
            opacity: 1,
            y: 0,
            rotate: 2,
            transition: {
                duration: 0.6,
                ease: [0.6, 0.05, 0.01, 0.9]
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: [0.6, 0.05, 0.01, 0.9]
            }
        }
    }

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Gradient Border Bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent_0%,rgba(203,213,225,0.5)_20%,rgba(203,213,225,1)_50%,rgba(203,213,225,0.5)_80%,transparent_100%)]
    dark:bg-[linear-gradient(to_right,transparent_0%,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.6)_50%,rgba(100,116,139,0.3)_80%,transparent_100%)]"
            />

            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-20"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
                >
                    <h2 className="text-4xl mb-6 text-resume-primary dark:text-resume-secondary">
                        Stop Struggling with Resume Creation
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        ResumeAI eliminates common pain points and helps you land interviews faster
                    </p>
                </motion.div>

                {/* Comparison Cards with Tilt */}
                <motion.div
                    className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Without Section - Tilted Left */}
                    <motion.div
                        className="relative"
                        variants={cardVariantsLeft}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute -top-4 left-0 right-0 text-center z-10">
                            <span className="inline-block bg-red-600 dark:bg-red-800 text-white px-6 py-2 rounded-t-lg text-lg font-semibold shadow-lg">
                                Without ResumeAI
                            </span>
                        </div>
                        <motion.div
                            className="bg-gray-50 dark:bg-black border-2 bg-[linear-gradient(135deg,rgba(239,68,68,0.1)_0%,rgba(254,242,242,0.8)_100%)]
    dark:bg-[linear-gradient(135deg,rgba(239,68,68,0.25)_0%,rgba(0,0,0,0.9)_50%,rgba(239,68,68,0.25)_100%)]
                             border-red-600/20 dark:border-red-700/20 rounded-lg p-6 pt-12 min-h-[420px] shadow-2xl"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <ul className="space-y-6">
                                {painPoints.map((point, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex gap-4 items-start group"
                                        variants={itemVariants}
                                    >
                                        <X className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-1" />
                                        <p className="text-gray-700 dark:text-gray-300 text-lg">
                                            {point.problem}
                                        </p>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* With Section - Tilted Right */}
                    <motion.div
                        className="relative"
                        variants={cardVariantsRight}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute -top-4 left-0 right-0 text-center z-10">
                            <span className="inline-block bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-t-lg text-lg font-semibold shadow-lg">
                                With ResumeAI
                            </span>
                        </div>
                        <motion.div
                            className="bg-[linear-gradient(135deg,rgba(16,185,129,0.1)_0%,rgba(236,253,245,0.8)_100%)]
                         dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.25)_0%,rgba(0,0,0,0.9)_50%,rgba(16,185,129,0.25)_100%)]
                         border-2 border-green-600/20 dark:border-green-700/20 rounded-lg p-6 pt-12 min-h-[420px] relative overflow-hidden shadow-2xl"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <ul className="space-y-6">
                                {painPoints.map((point, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex gap-4 items-start group"
                                        variants={itemVariants}
                                    >
                                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500 flex-shrink-0 mt-1" />
                                        <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">
                                            {point.solution}
                                        </p>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className="max-w-2xl mx-auto text-center mt-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.6, 0.05, 0.01, 0.9] }}
                >
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        <span className="text-resume-primary dark:text-resume-secondary font-semibold">
                            Land interviews faster
                        </span>{" "}
                        with ResumeAI
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default PainPointsSection;
