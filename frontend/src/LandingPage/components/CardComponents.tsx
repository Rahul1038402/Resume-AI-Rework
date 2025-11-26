import { useRef } from "react";
import GlowingCards, { GlowingCard } from "@/components/ui/glowing-cards";
import { useTheme } from "next-themes";
import { motion, useInView, Variants } from "framer-motion";

const NumberedFeatureCards = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const glowColor =
    theme === "dark" ? "hsl(221, 83%, 53%)" : "hsl(174, 84%, 32%)";

  const features = [
    {
      number: 1,
      title: "Upload Your Resume",
      description:
        "Simply upload your existing resume in PDF or DOCX format. Our AI will parse and analyze it instantly.",
      color: "#3b82f6",
    },
    {
      number: 2,
      title: "Get AI Analysis",
      description:
        "Receive detailed feedback on ATS compatibility, keyword optimization, and formatting suggestions tailored to your target role.",
      color: "#10b981",
    },
    {
      number: 3,
      title: "Optimize & Rebuild",
      description:
        "Use our builder to implement suggestions, choose from professional templates, and create an optimized version.",
      color: "#8b5cf6",
    },
    {
      number: 4,
      title: "Track Applications",
      description:
        "Save your resume versions, track where you've applied, and manage your entire job search from one dashboard.",
      color: "#f59e0b",
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
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
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Gradient Border Bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent_0%,rgba(203,213,225,0.5)_20%,rgba(203,213,225,1)_50%,rgba(203,213,225,0.5)_80%,transparent_100%)]
    dark:bg-[linear-gradient(to_right,transparent_0%,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.6)_50%,rgba(100,116,139,0.3)_80%,transparent_100%)]"
      />
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          <h2 className="text-4xl mb-6 text-resume-primary dark:text-resume-secondary">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your complete workflow from resume upload to job offer
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Vertical Gradient Line */}
          <motion.div
            className="absolute left-1/2 -ml-0.5"
            style={{
              top: '2rem',
              height: 'calc(100% - 10rem)',
            }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: [0.6, 0.05, 0.01, 0.9] }}
          >
            <div
              className="h-full w-1 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${features
                  .map((f) => f.color)
                  .join(", ")})`,
              }}
            />
          </motion.div>

          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              className="relative mb-16 last:mb-0"
              variants={itemVariants}
            >
              {/* Number Circle - Centered Above Card */}
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                  style={{
                    backgroundColor: feature.color,
                    boxShadow: `0 10px 40px ${feature.color}60`,
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.number}
                </motion.div>

                {/* Downward Arrow */}
                {index < features.length && (
                  <motion.div
                    className="mt-4 text-4xl animate-bounce"
                    style={{ color: feature.color }}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: index * 0.3 + 0.5, duration: 0.5 }}
                  >
                    ▾
                  </motion.div>
                )}

              </div>

              {/* Card */}
              <motion.div
                className="w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <GlowingCards
                  enableGlow={true}
                  glowRadius={25}
                  glowOpacity={0.6}
                  animationDuration={500}
                >
                  <GlowingCard
                    glowColor={feature.color}
                    className="p-6 border-t-4 transition-all duration-300 hover:shadow-2xl max-h-[300px] max-w-[500px] mx-auto"
                    style={{ borderTopColor: feature.color }}
                  >
                    <h3
                      className="text-2xl font-semibold mb-3 dark:text-resume-secondary"
                      style={{ color: feature.color }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      {feature.description}
                    </p>
                  </GlowingCard>
                </GlowingCards>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default NumberedFeatureCards;
