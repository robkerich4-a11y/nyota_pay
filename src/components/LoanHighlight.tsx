import { motion } from "framer-motion";

const LoanHighlight = () => {
  return (
    <motion.div 
      className="bg-card -mt-16 mx-auto mb-12 p-8 rounded-lg text-center shadow-card max-w-xl relative z-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
        Borrow Ksh. 1,000 - 60,000
      </h2>
      <p className="text-muted-foreground">
        New customers qualify for up to Ksh. 10,000 instantly.
      </p>
    </motion.div>
  );
};

export default LoanHighlight;
