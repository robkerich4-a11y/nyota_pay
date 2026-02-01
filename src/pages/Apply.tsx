import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, Loader2 } from "lucide-react";
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

  const [phone, setPhone] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("myLoan");

    if (!saved) return navigate("/eligibility");

    const data = JSON.parse(saved);
    setUserData(data);

    if (data.phone) {
      setPhone(data.phone);
    }
  }, [navigate]);

  const handleApply = () => {
    if (!selectedLoan) {
      toast.error("Please select a loan amount");
      return;
    }

    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^2547\d{8}$/.test(phone)) {
      toast.error("Enter valid phone number in format 2547XXXXXXXX");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleStkPush = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch(
        "https://pkurui-backend.onrender.com/api/stk-push",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone,
            amount: selectedLoan?.fee,
            customer_name: userData?.name || "Customer",
            reference: `NYOTA_${Date.now()}`,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("STK Push sent to your phone. Check M-Pesa.");

        setShowConfirmModal(false);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      toast.error("Network error connecting to payment service");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="gradient-primary text-primary-foreground py-4 px-5">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-6 h-6" />
          <span className="font-bold text-lg">Nyota Pay</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <motion.div className="bg-card rounded-xl shadow p-5 mb-4">
          <p className="text-sm">
            Hi{" "}
            <span className="font-semibold text-primary">
              {userData.name || "Customer"}
            </span>
            , select a loan amount and enter your phone number to receive
            M-Pesa STK push.
          </p>
        </motion.div>

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

        <div className="mb-4">
          <input
            type="tel"
            placeholder="Enter phone e.g 2547XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <Button className="w-full h-14" onClick={handleApply}>
          Get Loan Now <Zap className="ml-2 w-5 h-5" />
        </Button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 w-full mt-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </main>

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

            <p>
              Phone: <strong>{phone}</strong>
            </p>

            <Button
              className="w-full"
              onClick={handleStkPush}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending STK...
                </>
              ) : (
                "Proceed to Pay"
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Apply;
