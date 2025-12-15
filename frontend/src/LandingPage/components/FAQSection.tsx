import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is ResumeAI really free?",
      answer: "Yes! We're currently in beta and offering full free access while we improve the product based on user feedback."
    },
    {
      question: "Do I need to create an account?",
      answer: "You can try the resume builder without signup. Create an account (free) to save your work and access the job tracker."
    },
    {
      question: "What happens to my resume data?",
      answer: "Your data is private and secure. We never share your information with third parties or use it for marketing."
    },
    {
      question: "Will ResumeAI always be free?",
      answer: "Beta users enjoy full free access. When we launch premium features, early users will receive special founder pricing."
    },
    {
      question: "How does the ATS analysis work?",
      answer: "Our AI analyzes your resume against ATS algorithms used by major companies, checking keyword optimization, formatting, and compatibility."
    },
    {
      question: "Can I use this for any industry?",
      answer: "Currently optimized for tech roles (software engineering, product, design). Support for other industries coming soon."
    },
    {
      question: "Is this actually better than other resume builders?",
      answer: "ResumeAI was built by a developer who personally used it to land a US remote internship. It focuses specifically on beating ATS systems with AI-powered optimization, not just templates."
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
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-6 text-blue-600 dark:text-cyan-400">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about ResumeAI
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-5 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Still have questions?
            </p>
            <button
              className="text-blue-600 dark:text-cyan-400 hover:underline font-medium"
              onClick={() => window.location.href = '/contact'}
            >
              Get in touch with us
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;