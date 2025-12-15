import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface StatItemProps {
  key: number;
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

const StatItem = ({ value, label, suffix = "+", duration = 2 }: StatItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: duration,
        ease: [0.6, 0.05, 0.01, 0.9]
      });
      return controls.stop;
    }
  }, [isInView, count, value, duration]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
    >
      <motion.h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-resume-primary dark:text-resume-secondary mb-3">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </motion.h3>
      <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
        {label}
      </p>
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      value: 90,
      label: "ATS compatibility score achievable",
      suffix: "%",
    },
    {
      value: 5,
      label: "Minutes to build a complete resume",
      suffix: "",
    },
    {
      value: 10,
      label: "Seconds to get AI feedback",
      suffix: "",
      duration: 2,
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent_0%,rgba(203,213,225,0.5)_20%,rgba(203,213,225,1)_50%,rgba(203,213,225,0.5)_80%,transparent_100%)]
    dark:bg-[linear-gradient(to_right,transparent_0%,rgba(100,116,139,0.3)_20%,rgba(100,116,139,0.6)_50%,rgba(100,116,139,0.3)_80%,transparent_100%)]"
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          <h2 className="text-4xl mb-6 text-resume-primary dark:text-resume-secondary">
            The Numbers Speak for Themselves
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Every day Resume AI helps job seekers optimize their resumes and land interviews and the numbers keep growing.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              duration={stat.duration}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
