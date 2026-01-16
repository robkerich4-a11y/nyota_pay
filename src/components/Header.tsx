import { Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-primary" />
            <span className="font-bold text-xl text-primary">Nyota Pay</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
