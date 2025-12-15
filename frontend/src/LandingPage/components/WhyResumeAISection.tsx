import { motion } from "framer-motion";
import { Target, Zap, Lock } from "lucide-react";

const WhyResumeAISection = () => {
  const features = [
    {
      icon: Target,
      title: "Built for ATS",
      description: "90% compatibility score achievable",
      color: "#3b82f6"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Build in 5 minutes or less",
      color: "#10b981"
    },
    {
      icon: Lock,
      title: "Your Data, Private",
      description: "We never share your information",
      color: "#8b5cf6"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent_0%,rgba(203,213,225,0.5)_20%,rgba(203,213,225,1)_50%,rgba(203,213,225,0.5)_80%,transparent_100%)]
    dark:bg-[linear-gradient(to_right,transparent_0%,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.6)_50%,rgba(100,116,139,0.3)_80%,transparent_100%)]"
      />

      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-6 text-blue-600 dark:text-cyan-400">
              Why ResumeAI?
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.15,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 20px 40px ${feature.color}20`
                }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ 
                    backgroundColor: `${feature.color}20`,
                  }}
                >
                  <feature.icon 
                    className="w-8 h-8"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 
                  className="text-2xl font-semibold mb-3"
                  style={{ color: feature.color }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              className="bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/80 text-white dark:text-black px-8 py-4 rounded-lg text-lg font-medium transition-colors"
              onClick={() => window.location.href = '/builder'}
            >
              Try ResumeAI Free
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyResumeAISection;