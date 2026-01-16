import { motion } from "framer-motion";
import { Zap, FileText, Shield, Users } from "lucide-react";

const features = [
  { icon: Zap, text: "5-Minute Approval" },
  { icon: FileText, text: "No Paperwork" },
  { icon: Shield, text: "Bank-Level Security" },
  { icon: Users, text: "No Guarantors" },
];

const Features = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Why Choose Nyota Pay?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          We make borrowing simple, fast, and secure
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.text}
            className="bg-card rounded-lg p-8 text-center shadow-card border-t-4 border-primary hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <feature.icon className="w-10 h-10 text-primary mx-auto mb-4" />
            <p className="font-semibold text-foreground">{feature.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
