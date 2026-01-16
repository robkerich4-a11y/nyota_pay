import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, CheckCircle, Smartphone, X } from "lucide-react";
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
  { amount: 5500, fee: 1550 },
];

const formatCurrency = (amount: number) => `Ksh ${amount.toLocaleString()}`;

const Apply = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("myLoan");
    if (!saved) return navigate("/eligibility");
    setUserData(JSON.parse(saved));
  }, [navigate]);

  const handleApply = () => {
    if (!selectedLoan) {
      toast.error("Please select a loan amount");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleVerify = () => {
    toast.success("Payment verification pending");
    setShowPaymentModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-4 px-5">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-6 h-6" />
          <span className="font-bold text-lg">Nyota Pay</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <motion.div className="bg-card rounded-xl p-5 mb-5 shadow">
          <h2 className="text-center text-xl font-bold text-primary mb-4">
            Select Loan Amount
          </h2>

          {loanOptions.map((loan) => (
            <button
              key={loan.amount}
              onClick={() => setSelectedLoan(loan)}
              className="w-full bg-muted border rounded-xl p-4 text-center"
            >
              <p className="font-bold text-primary">
                {formatCurrency(loan.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                Fee: {formatCurrency(loan.fee)}
              </p>
            </button>
          ))}
        </motion.div>

        <Button onClick={handleApply} className="w-full h-14">
          Proceed to Payment
        </Button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 w-full mt-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </main>

      {/* PAYMENT INSTRUCTIONS MODAL */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              Payment Instructions
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to <strong>M-Pesa</strong> on your phone</li>
              <li>
                Select <strong>Lipa na M-Pesa</strong> →{" "}
                <strong>Buy Goods and Services</strong>
              </li>
              <li>
                Enter Till Number:
                <div className="font-bold text-primary mt-1">
                  Inuka Ventures<br />4019420
                </div>
              </li>
              <li>
                Enter Amount:
                <strong className="ml-1 text-primary">Ksh 1,550</strong>
              </li>
              <li>Enter your M-Pesa PIN to complete payment</li>
            </ol>

            <Button className="w-full mt-4" onClick={handleVerify}>
              Verify Payment
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPaymentModal(false)}
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Apply;
