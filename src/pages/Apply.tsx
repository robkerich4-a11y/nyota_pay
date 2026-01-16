import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowLeft, CheckCircle, Smartphone, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoanOption {
  amount: number;
  fee: number;
}

const loanOptions: LoanOption[] = [
  { amount: 5500, fee: 100 },
  { amount: 6800, fee: 130 },
  { amount: 7800, fee: 170 },
  { amount: 9800, fee: 190 },
  { amount: 11200, fee: 230 },
  { amount: 16800, fee: 250 },
  { amount: 21200, fee: 270 },
  { amount: 25600, fee: 400 },
  { amount: 30000, fee: 470 },
  { amount: 35400, fee: 590 },
  { amount: 39800, fee: 730 },
  { amount: 44200, fee: 1010 },
  { amount: 48600, fee: 1600 },
  { amount: 60600, fee: 2050 },
];

const formatCurrency = (amount: number) => {
  return `Ksh ${amount.toLocaleString()}`;
};

const formatPhoneNumber = (phone: string) => {
  const p = phone.replace(/\D/g, "");
  if (p.startsWith("0")) return "254" + p.substring(1);
  if (p.startsWith("7") || p.startsWith("1")) return "254" + p;
  return p;
};

const Apply = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{
    name?: string;
    phone_number?: string;
    id_number?: string;
    loan_type?: string;
  } | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("myLoan");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (!data.phone_number) {
          navigate("/eligibility");
          return;
        }
        setUserData(data);
      } catch {
        navigate("/eligibility");
      }
    } else {
      navigate("/eligibility");
    }
  }, [navigate]);

  const handleSelectLoan = (loan: LoanOption) => {
    setSelectedLoan(loan);
  };

  const handleApply = () => {
    if (!selectedLoan) {
      toast.error("Please select a loan amount to continue");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    // Simulate STK push initiation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setShowSuccessModal(true);
  };

  const handleDone = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  if (!userData) return null;

  const formattedPhone = userData.phone_number
    ? formatPhoneNumber(userData.phone_number)
    : "";

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-4 px-5">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-6 h-6" />
          <span className="font-bold text-lg">Hela Sasa</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome Card */}
        <motion.div
          className="bg-card rounded-xl shadow-card p-5 mb-4 border border-primary/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm leading-relaxed">
            Hi{" "}
            <span className="font-semibold text-primary">
              {userData.name || "Customer"}
            </span>
            , you qualify for these loan options based on your M-Pesa records
            (2-month term at 10% interest).
          </p>
        </motion.div>

        {/* Loan Selection Card */}
        <motion.div
          className="bg-card rounded-xl shadow-card p-5 mb-5 border border-primary/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-center text-xl font-bold text-primary mb-4">
            Select Your Loan Amount
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {loanOptions.map((loan) => (
              <button
                key={loan.amount}
                onClick={() => handleSelectLoan(loan)}
                className={`
                  bg-muted border rounded-xl p-4 text-center transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-md
                  ${
                    selectedLoan?.amount === loan.amount
                      ? "border-primary bg-accent shadow-md"
                      : "border-primary/20 hover:border-primary/40"
                  }
                `}
              >
                <p className="text-base font-bold text-primary mb-1">
                  {formatCurrency(loan.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fee: {formatCurrency(loan.fee)}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Apply Button */}
        <Button
          onClick={handleApply}
          disabled={!selectedLoan || isProcessing}
          className="w-full h-14 text-base font-semibold"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Processing...
            </>
          ) : (
            <>
              Get Loan Now <Zap className="w-5 h-5" />
            </>
          )}
        </Button>

        {!selectedLoan && (
          <p className="text-center text-sm text-destructive mt-3">
            Please select a loan amount to continue
          </p>
        )}

        {/* App Promo */}
        <motion.div
          className="bg-card rounded-xl shadow-card p-5 mt-6 text-center border border-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-primary font-medium mb-3">
            For loans up to Ksh 80,000, download our app:
          </p>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download App
          </Button>
        </motion.div>

        {/* Back Link */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 w-full mt-6 text-muted-foreground hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </main>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="gradient-primary text-primary-foreground p-5 text-center">
            <CheckCircle className="w-10 h-10 mx-auto mb-2" />
            <DialogTitle className="text-lg font-bold">Confirm Loan</DialogTitle>
            <p className="text-sm opacity-90">Review details before payment</p>
          </div>

          <div className="p-5">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Loan Amount:</span>
                <span className="font-bold text-primary">
                  {selectedLoan && formatCurrency(selectedLoan.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Processing Fee:</span>
                <span className="font-bold text-primary">
                  {selectedLoan && formatCurrency(selectedLoan.fee)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Repayment:</span>
                <span className="font-bold text-primary">
                  {selectedLoan && formatCurrency(Math.round(selectedLoan.amount * 1.1))}
                </span>
              </div>
            </div>

            <div className="bg-accent rounded-lg p-3 mt-4 text-center">
              <div className="flex items-center justify-center gap-2 font-semibold text-primary">
                <Smartphone className="w-4 h-4" />
                {formattedPhone}
              </div>
            </div>
          </div>

          <div className="p-4 pt-0 space-y-2">
            <Button onClick={handleConfirmPayment} className="w-full h-12 gap-2">
              <CheckCircle className="w-5 h-5" />
              Proceed
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="w-full h-12 gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="gradient-primary text-primary-foreground p-5 text-center">
            <Smartphone className="w-10 h-10 mx-auto mb-2" />
            <DialogTitle className="text-lg font-bold">Request Sent</DialogTitle>
          </div>

          <div className="p-5 text-center">
            <h3 className="text-lg font-bold mb-2">Check Your Phone</h3>
            <p className="text-muted-foreground mb-4">
              Enter M-Pesa PIN to pay{" "}
              <strong className="text-primary">
                {selectedLoan && formatCurrency(selectedLoan.fee)}
              </strong>
            </p>

            <div className="bg-accent rounded-lg p-3 mb-4">
              <span className="font-semibold text-primary">{formattedPhone}</span>
            </div>

            <div className="bg-muted rounded-lg p-4 text-left border-l-4 border-primary">
              <p className="font-semibold mb-2">Instructions:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Check your phone now</li>
                <li>Enter PIN for Hela Sasa</li>
                <li>Wait for the confirmation SMS</li>
              </ol>
            </div>
          </div>

          <div className="bg-accent/50 p-4 text-center border-t border-border">
            <p className="text-sm text-primary font-medium">
              ✓ STK Push Successful
            </p>
          </div>

          <div className="p-4 pt-0">
            <Button onClick={handleDone} className="w-full h-12">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Apply;
