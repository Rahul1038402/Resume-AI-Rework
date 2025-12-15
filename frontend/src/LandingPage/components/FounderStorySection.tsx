import { motion } from "framer-motion";
import { CheckCircle2, Award, Briefcase, Sparkles, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

const FounderStorySection = () => {
  const highlights = [
    {
      icon: Briefcase,
      text: "Created ResumeAI after 50+ job applications",
      color: "#3b82f6"
    },
    {
      icon: Award,
      text: "Landed US remote internship in 3 weeks",
      color: "#10b981"
    },
    {
      icon: Sparkles,
      text: "Now helping beta users optimize their resumes",
      color: "#8b5cf6"
    }
  ];

    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const proofItems = [
    {
      title: "Resume That Worked",
      subtitle: "Built with Resume AI",
      image: "/screenshots/my-resume.png", // Your actual resume screenshot
      badge: "ATS Optimized",
      badgeColor: "#10b981",
      details: [
        { IconComponent: CheckCircle2, text: "92% ATS Score", color: "#10b981" },
        { IconComponent: Award, text: "Professional Template", color: "#3b82f6" }
      ]
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent_0%,rgba(203,213,225,0.5)_20%,rgba(203,213,225,1)_50%,rgba(203,213,225,0.5)_80%,transparent_100%)]
    dark:bg-[linear-gradient(to_right,transparent_0%,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.6)_50%,rgba(100,116,139,0.3)_80%,transparent_100%)]"
      />

      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-6 text-blue-600 dark:text-cyan-400">
              Built by a Job Seeker, For Job Seekers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              After struggling with generic resume templates and ATS rejections, I created ResumeAI. 
              Three weeks later, I landed a remote internship at a US-based startup. 
              Now I'm helping others do the same.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ 
                    backgroundColor: `${highlight.color}20`,
                  }}
                >
                  <highlight.icon 
                    className="w-6 h-6"
                    style={{ color: highlight.color }}
                  />
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {highlight.text}
                </p>
              </motion.div>
            ))}
          </div>

                    {/* Proof Cards Grid */}
          <div className="grid gap-8">
            {proofItems.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-transparent rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.subtitle}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: item.badgeColor }}
                      >
                        {item.badge}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex gap-4 mt-4">
                      {item.details.map((detail, idx) => {
                        const Icon = detail.IconComponent;
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <Icon
                              className="w-4 h-4"
                              style={{ color: detail.color }}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {detail.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image Display */}
                  <div className="relative bg-transparent p-6">
                    <motion.div
                      className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg"
                      animate={{
                        scale: hoveredCard === index ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="800"%3E%3Crect fill="%23${index === 0 ? 'f3f4f6' : 'e5e7eb'}" width="600" height="800"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%236b7280"%3E${item.title}%3C/text%3E%3Ctext x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3EAdd your screenshot here%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                    </motion.div>

                    {/* Blur overlay for sensitive info (optional) */}
                    {index === 1 && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/80 dark:bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-white dark:text-gray-900 text-sm font-medium">
                          Partially Redacted for Privacy
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center pt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              className="bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/80 text-white dark:text-black px-8 py-4 rounded-lg text-lg font-medium transition-colors"
              onClick={() => window.location.href = '/builder'}
            >
              Use the Same Tool I Used
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderStorySection;