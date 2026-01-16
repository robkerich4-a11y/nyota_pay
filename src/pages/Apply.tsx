import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  ArrowLeft,
  X,
  Download,
  Copy,
  Check,
} from "lucide-react";
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

const formatCurrency = (amount: number) =>
  `Ksh ${amount.toLocaleString()}`;

const Apply = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [selectedLoan, setSelectedLoan] =
    useState<LoanOption | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copied, setCopied] = useState(false);

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
    setShowConfirmModal(true);
  };

  const handleProceed = () => {
    setShowConfirmModal(false);
    setShowPaymentModal(true);
  };

  const handleCopyTill = async () => {
    await navigator.clipboard.writeText("4019420");
    setCopied(true);
    toast.success("Till number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = () => {
    toast.success("Payment submitted for verification");
    setShowPaymentModal(false);
    navigate("/");
  };

  if (!userData) return null;

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
        {/* Welcome */}
        <motion.div className="bg-card rounded-xl shadow p-5 mb-4">
          <p className="text-sm">
            Hi{" "}
            <span className="font-semibold text-primary">
              {userData.name || "Customer"}
            </span>
            , select a loan amount below. Processing fee is paid before
            disbursement.
          </p>
        </motion.div>

        {/* Loan Options */}
        <motion.div className="bg-card rounded-xl shadow p-5 mb-5">
          <h2 className="text-center text-xl font-bold text-primary mb-4">
            Select Your Loan Amount
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {loanOptions.map((loan) => (
              <button
                key={loan.amount}
                onClick={() => setSelectedLoan(loan)}
                className={`border rounded-xl p-4 transition
                ${
                  selectedLoan?.amount === loan.amount
                    ? "border-primary bg-accent"
                    : "border-primary/20"
                }`}
              >
                <p className="font-bold text-primary">
                  {formatCurrency(loan.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fee: {formatCurrency(loan.fee)}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        <Button className="w-full h-14" onClick={handleApply}>
          Get Loan Now <Zap className="ml-2 w-5 h-5" />
        </Button>

        {/* App Promo */}
        <motion.div className="bg-card rounded-xl shadow p-5 mt-6 text-center">
          <p className="text-sm text-primary mb-3">
            For loans up to Ksh 80,000, download our app:
          </p>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download App
          </Button>
        </motion.div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 w-full mt-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </main>

      {/* Confirm Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Loan</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <p>
              Loan Amount:{" "}
              <strong>
                {selectedLoan && formatCurrency(selectedLoan.amount)}
              </strong>
            </p>
            <p>
              Processing Fee:{" "}
              <strong>
                {selectedLoan && formatCurrency(selectedLoan.fee)}
              </strong>
            </p>

            <Button className="w-full" onClick={handleProceed}>
              Proceed to Payment
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowConfirmModal(false)}
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Payment Instructions</DialogTitle>
          </DialogHeader>

          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to M-Pesa on your phone</li>
            <li>
              Select <strong>Lipa na M-Pesa</strong> →{" "}
              <strong>Buy Goods & Services</strong>
            </li>
            <li>
              Till Number:
              <div className="flex items-center justify-between mt-1 bg-muted p-2 rounded">
                <strong className="text-primary">
                  Inuka Ventures – 4019420
                </strong>
                <button
                  onClick={handleCopyTill}
                  className="text-primary"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </li>
            <li>
              Enter Amount:
              <strong className="ml-1 text-primary">
                {selectedLoan && formatCurrency(selectedLoan.fee)}
              </strong>
            </li>
            <li>Enter your M-Pesa PIN to complete payment</li>
          </ol>

          <Button className="w-full mt-4" onClick={handleVerifyPayment}>
            Verify Payment
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Apply;
