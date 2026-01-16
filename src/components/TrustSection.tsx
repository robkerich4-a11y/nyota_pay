import { motion } from "framer-motion";
import { Lock, Award, CheckCircle } from "lucide-react";

const badges = [
  { icon: Lock, text: "SSL Secured" },
  { icon: Award, text: "CBK Licensed" },
  { icon: CheckCircle, text: "Verified Service" },
];

const TrustSection = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Trusted & Secure
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Your security and trust are our top priorities
        </p>
      </div>

      <motion.div 
        className="flex justify-center gap-4 flex-wrap max-w-3xl mx-auto mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {badges.map((badge, index) => (
          <div
            key={badge.text}
            className="bg-card border border-primary/20 py-3 px-5 rounded-full text-sm flex items-center gap-2 shadow-card"
          >
            <badge.icon className="w-4 h-4 text-primary" />
            <span className="font-medium">{badge.text}</span>
          </div>
        ))}
      </motion.div>

      <p className="text-center text-muted-foreground">
        Trusted by over <span className="font-semibold text-primary">60,000</span> Kenyans nationwide
      </p>
    </section>
  );
};

export default TrustSection;
