import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, User, Phone, CreditCard, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";

const eligibilitySchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, dots, apostrophes and hyphens"),
  phone_number: z.string()
    .trim()
    .regex(/^(?:\+?254|0)[17]\d{8}$/, "Please enter a valid Safaricom number (07XXXXXXXX or +254...)"),
  id_number: z.string()
    .trim()
    .regex(/^\d{7,10}$/, "Please enter a valid Kenyan ID (7-10 digits)"),
  loan_type: z.string().min(1, "Please select a loan type"),
});

type EligibilityData = z.infer<typeof eligibilitySchema>;

const loanTypes = [
  { value: "business", label: "Business Loan" },
  { value: "personal", label: "Personal Loan" },
  { value: "education", label: "Education Loan" },
  { value: "medical", label: "Medical Loan" },
  { value: "emergency", label: "Emergency Loan" },
];

const Eligibility = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<EligibilityData>>({
    name: "",
    phone_number: "",
    id_number: "",
    loan_type: "",
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("myLoan");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data);
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = eligibilitySchema.safeParse(formData);
    
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setIsLoading(true);
    
    // Store validated data
    sessionStorage.setItem("myLoan", JSON.stringify(result.data));

    // Simulate API check
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    setIsLoading(false);
    navigate("/apply");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-8 px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Zap className="w-7 h-7" />
          <span className="font-bold text-xl">Hela Sasa</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Check Your Loan Eligibility
          </h1>
          <p className="opacity-90 mb-4">
            Find out how much you qualify for instantly
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 font-semibold">
            Ksh. 1,500 – 60,000
          </div>
        </motion.div>
      </header>

      {/* Form */}
      <main className="max-w-md mx-auto px-5 py-8 -mt-4">
        <motion.form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl shadow-card p-6 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
              <User className="w-4 h-4 text-primary" />
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12"
              maxLength={100}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
              <Phone className="w-4 h-4 text-primary" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="07XXXXXXXX"
              value={formData.phone_number || ""}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="h-12"
              maxLength={13}
            />
          </div>

          {/* ID Field */}
          <div className="space-y-2">
            <Label htmlFor="id_number" className="flex items-center gap-2 text-foreground">
              <CreditCard className="w-4 h-4 text-primary" />
              ID Number
            </Label>
            <Input
              id="id_number"
              type="text"
              placeholder="Enter your ID number"
              value={formData.id_number || ""}
              onChange={(e) => setFormData({ ...formData, id_number: e.target.value.replace(/\D/g, "") })}
              className="h-12"
              maxLength={10}
            />
          </div>

          {/* Loan Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <CreditCard className="w-4 h-4 text-primary" />
              Select Loan Type
            </Label>
            <Select
              value={formData.loan_type || ""}
              onValueChange={(value) => setFormData({ ...formData, loan_type: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose loan purpose" />
              </SelectTrigger>
              <SelectContent>
                {loanTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 py-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              Secure Application
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              No CRB Check
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              Instant Approval
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Checking Eligibility...
              </>
            ) : (
              <>
                Check Eligibility <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            No paperwork required. No guarantors needed.
          </p>
        </motion.form>
      </main>
    </div>
  );
};

export default Eligibility;
