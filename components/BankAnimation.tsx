"use client";

import { useEffect, useState } from "react";
import { CreditCard, Calculator, TrendingUp, TrendingDown, Sparkles } from "lucide-react";

interface Transaction {
  id: number;
  label: string;
  amount: number;
  type: "expense" | "refund";
  visible: boolean;
  strikethrough: boolean;
}

interface FlyingMoney {
  id: number;
  active: boolean;
  direction: "toBank" | "toCalc";
}

export default function BankAnimation() {
  const [phase, setPhase] = useState(0);
  const [balance, setBalance] = useState(12450);
  const [displayBalance, setDisplayBalance] = useState(12450);
  const [calculatorValue, setCalculatorValue] = useState("");
  const [calcBounce, setCalcBounce] = useState(false);
  const [bankBounce, setBankBounce] = useState(false);
  const [calcRotate, setCalcRotate] = useState(0);
  const [bankRotate, setBankRotate] = useState(0);
  const [flyingMoney, setFlyingMoney] = useState<FlyingMoney[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, label: "מס הכנסה", amount: 2100, type: "expense", visible: true, strikethrough: false },
    { id: 2, label: "ביטוח לאומי", amount: 850, type: "expense", visible: true, strikethrough: false },
    { id: 3, label: "החזר מס 2023", amount: 3200, type: "refund", visible: false, strikethrough: false },
    { id: 4, label: "החזר מס 2022", amount: 1800, type: "refund", visible: false, strikethrough: false },
  ]);

  // Trigger bounce animation with rotation - SLOWER (700ms)
  const triggerCalcBounce = () => {
    setCalcBounce(true);
    setCalcRotate(prev => prev === 0 ? 3 : prev === 3 ? -3 : 0);
    setTimeout(() => {
      setCalcBounce(false);
      setCalcRotate(0);
    }, 700);
  };

  const triggerBankBounce = () => {
    setBankBounce(true);
    setBankRotate(prev => prev === 0 ? -2 : prev === -2 ? 2 : 0);
    setTimeout(() => {
      setBankBounce(false);
      setBankRotate(0);
    }, 700);
  };

  // Shoot flying money from calculator to bank
  const shootMoney = (count: number = 3) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const id = Date.now() + i;
        setFlyingMoney(prev => [...prev, { id, active: true, direction: "toBank" }]);

        // Remove after animation
        setTimeout(() => {
          setFlyingMoney(prev => prev.filter(m => m.id !== id));
        }, 1200);
      }, i * 200);
    }
  };

  // Shoot flying money from bank to calculator (reverse)
  const shootMoneyReverse = (count: number = 2) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const id = Date.now() + i + 1000;
        setFlyingMoney(prev => [...prev, { id, active: true, direction: "toCalc" }]);

        // Remove after animation
        setTimeout(() => {
          setFlyingMoney(prev => prev.filter(m => m.id !== id));
        }, 1200);
      }, i * 200);
    }
  };

  // Animate balance counting up
  const animateBalance = (from: number, to: number, duration: number = 1500) => {
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = (to - from) / steps;

    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        const current = Math.round(from + increment * i);
        setDisplayBalance(current);
      }, stepDuration * i);
    }
  };

  useEffect(() => {
    const animationCycle = () => {
      // Reset state for new cycle
      setPhase(0);
      setBalance(12450);
      setDisplayBalance(12450);
      setCalculatorValue("");
      setFlyingMoney([]);
      setIsCalculating(false);
      setTransactions([
        { id: 1, label: "מס הכנסה", amount: 2100, type: "expense", visible: true, strikethrough: false },
        { id: 2, label: "ביטוח לאומי", amount: 850, type: "expense", visible: true, strikethrough: false },
        { id: 3, label: "החזר מס 2023", amount: 3200, type: "refund", visible: false, strikethrough: false },
        { id: 4, label: "החזר מס 2022", amount: 1800, type: "refund", visible: false, strikethrough: false },
      ]);

      // Phase 1: Calculator wakes up (1.5s)
      setTimeout(() => {
        setPhase(1);
        triggerCalcBounce();
      }, 1500);

      // Phase 2: Calculator searching for data (3s)
      setTimeout(() => {
        setCalculatorValue("...");
        setIsCalculating(true);
        triggerCalcBounce();
      }, 3000);

      // Bank responds (4s)
      setTimeout(() => {
        triggerBankBounce();
      }, 4000);

      // Phase 3: Calculator shows balance (5s)
      setTimeout(() => {
        setPhase(2);
        setCalculatorValue("₪12,450");
        setIsCalculating(false);
        triggerCalcBounce();
      }, 5000);

      // Bank sends data - money flies to calculator (6s)
      setTimeout(() => {
        shootMoneyReverse(3);
        triggerBankBounce();
      }, 6000);

      // Phase 4: Calculator shows expense 1 (7s)
      setTimeout(() => {
        setPhase(3);
        setCalculatorValue("- ₪2,100");
        triggerCalcBounce();
      }, 7000);

      // Expense 1 gets strikethrough (8s)
      setTimeout(() => {
        setTransactions(prev => prev.map(t =>
          t.id === 1 ? { ...t, strikethrough: true } : t
        ));
        triggerBankBounce();
      }, 8000);

      // Phase 5: Calculator shows expense 2 (9.5s)
      setTimeout(() => {
        setPhase(4);
        setCalculatorValue("- ₪850");
        triggerCalcBounce();
      }, 9500);

      // Expense 2 gets strikethrough (10.5s)
      setTimeout(() => {
        setTransactions(prev => prev.map(t =>
          t.id === 2 ? { ...t, strikethrough: true } : t
        ));
        triggerBankBounce();
      }, 10500);

      // Phase 6: Expenses fade out one by one (12s)
      setTimeout(() => {
        setPhase(5);
        setCalculatorValue("מחשב...");
        setIsCalculating(true);
        setTransactions(prev => prev.map(t =>
          t.id === 1 ? { ...t, visible: false } : t
        ));
        triggerBankBounce();
      }, 12000);

      // Second expense fades (13s)
      setTimeout(() => {
        setTransactions(prev => prev.map(t =>
          t.id === 2 ? { ...t, visible: false } : t
        ));
        triggerBankBounce();
      }, 13000);

      // Phase 7: Calculating refunds (13.5s)
      setTimeout(() => {
        setPhase(6);
        triggerCalcBounce();
      }, 13500);

      // Phase 8: Calculator shows refund 1 (15s)
      setTimeout(() => {
        setPhase(7);
        setCalculatorValue("+ ₪3,200");
        setIsCalculating(false);
        triggerCalcBounce();
      }, 15000);

      // Money flies to bank (16s)
      setTimeout(() => {
        shootMoney(3);
      }, 16000);

      // Refund 1 appears in bank (17s)
      setTimeout(() => {
        setTransactions(prev => prev.map(t =>
          t.id === 3 ? { ...t, visible: true } : t
        ));
        triggerBankBounce();
      }, 17000);

      // Phase 9: Calculator shows refund 2 (18.5s)
      setTimeout(() => {
        setPhase(8);
        setCalculatorValue("+ ₪1,800");
        triggerCalcBounce();
      }, 18500);

      // Money flies to bank (19.5s)
      setTimeout(() => {
        shootMoney(3);
      }, 19500);

      // Refund 2 appears in bank (20.5s)
      setTimeout(() => {
        setTransactions(prev => prev.map(t =>
          t.id === 4 ? { ...t, visible: true } : t
        ));
        triggerBankBounce();
      }, 20500);

      // Phase 10: Calculator shows total (22s)
      setTimeout(() => {
        setPhase(9);
        setCalculatorValue("= ₪17,450");
        triggerCalcBounce();
      }, 22000);

      // Phase 11: Balance updates with animation + celebration (23s)
      setTimeout(() => {
        setPhase(10);
        setBalance(17450);
        animateBalance(12450, 17450, 1500);
        shootMoney(5);
        triggerBankBounce();
      }, 23000);

      // Final celebration (24s)
      setTimeout(() => {
        setCalculatorValue("✓ חיסכון!");
        triggerCalcBounce();
      }, 24000);

      // Extra celebration bounce (25s)
      setTimeout(() => {
        triggerCalcBounce();
        triggerBankBounce();
      }, 25000);

      // Hold final state and restart (30s)
      setTimeout(() => {
        animationCycle();
      }, 30000);
    };

    animationCycle();
  }, []);

  return (
    <div className="hidden lg:flex gap-12 items-center relative">
      {/* Flying Money Symbols - To Bank */}
      {flyingMoney.filter(m => m.direction === "toBank").map((money, index) => (
        <div
          key={money.id}
          className="absolute z-50 pointer-events-none"
          style={{
            right: '220px',
            top: `${40 + (index % 3) * 30}%`,
            animation: 'flyToBank 1s ease-out forwards',
            animationDelay: `${(index % 3) * 0.1}s`,
          }}
        >
          <span className="text-2xl font-bold text-[#0090D5] drop-shadow-lg">₪</span>
        </div>
      ))}

      {/* Flying Money Symbols - To Calculator */}
      {flyingMoney.filter(m => m.direction === "toCalc").map((money, index) => (
        <div
          key={money.id}
          className="absolute z-50 pointer-events-none"
          style={{
            left: '220px',
            top: `${40 + (index % 3) * 30}%`,
            animation: 'flyToCalc 1s ease-out forwards',
            animationDelay: `${(index % 3) * 0.1}s`,
          }}
        >
          <span className="text-2xl font-bold text-[#0090D5] drop-shadow-lg">₪</span>
        </div>
      ))}

      {/* Bank Account Screen */}
      <div
        className={`w-80 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl transition-all duration-500 origin-center`}
        style={{
          transform: `scale(${bankBounce ? 1.05 : 1}) rotate(${bankRotate}deg)`,
          boxShadow: bankBounce ? '0 0 40px rgba(0,144,213,0.4)' : undefined,
        }}
      >
        {/* Bank Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
          <div
            className="w-12 h-12 bg-[#0090D5] rounded-xl flex items-center justify-center transition-transform duration-500"
            style={{ transform: `rotate(${bankBounce ? 15 : 0}deg)` }}
          >
            <CreditCard size={24} className="text-white" />
          </div>
          <div>
            <div className="text-white/60 text-xs">חשבון עו״ש</div>
            <div className="text-white font-bold text-lg">Done Bank</div>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <div className="text-white/60 text-sm mb-1">יתרה נוכחית</div>
          <div
            className={`text-4xl font-bold transition-all duration-500 ${phase >= 10 ? 'text-[#0090D5]' : 'text-white'}`}
            style={{ transform: `scale(${bankBounce ? 1.1 : 1})` }}
          >
            ₪{displayBalance.toLocaleString()}
          </div>
          {phase >= 10 && (
            <div className="flex items-center gap-2 text-[#0090D5] text-base mt-2">
              <Sparkles size={16} className="animate-spin" />
              <span className="animate-pulse font-bold">+₪5,000 חיסכון!</span>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="space-y-2">
          <div className="text-white/60 text-xs mb-3">תנועות אחרונות</div>

          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-700
                ${transaction.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 h-0 py-0 overflow-hidden'}
                ${transaction.type === "expense" ? 'bg-red-500/10' : 'bg-[#0090D5]/20'}
                ${transaction.strikethrough ? 'line-through opacity-40' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                {transaction.type === "expense" ? (
                  <TrendingDown size={16} className={`text-red-400 ${transaction.strikethrough ? 'animate-pulse' : ''}`} />
                ) : (
                  <TrendingUp size={16} className="text-[#0090D5]" />
                )}
                <span className="text-white">{transaction.label}</span>
              </div>
              <span className={`font-bold ${transaction.type === "expense" ? 'text-red-400' : 'text-[#0090D5]'}`}>
                {transaction.type === "expense" ? "-" : "+"}₪{transaction.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Line with flowing dots */}
      <div className="flex flex-col items-center gap-1 w-16">
        <div className={`h-1 w-full rounded-full transition-all duration-500 ${phase >= 2 ? 'bg-[#0090D5]' : 'bg-white/20'}`}>
          {phase >= 2 && (
            <div className="h-full w-4 bg-white rounded-full animate-pulse"
              style={{ animation: 'flowRight 1.5s infinite linear' }}
            />
          )}
        </div>
        <div className={`text-xs transition-opacity duration-500 ${phase >= 2 ? 'text-[#0090D5] opacity-100' : 'opacity-0'}`}>
          {phase >= 10 ? '✓' : '↔'}
        </div>
      </div>

      {/* Calculator */}
      <div
        className={`w-64 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl transition-all duration-500 origin-center`}
        style={{
          transform: `scale(${calcBounce ? 1.05 : 1}) rotate(${calcRotate}deg)`,
          boxShadow: calcBounce ? '0 0 40px rgba(0,144,213,0.4)' : undefined,
        }}
      >
        {/* Calculator Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
          <div
            className="w-12 h-12 bg-[#0090D5] rounded-xl flex items-center justify-center transition-transform duration-500"
            style={{ transform: `rotate(${calcBounce ? -15 : 0}deg)` }}
          >
            <Calculator size={24} className="text-white" />
          </div>
          <div>
            <div className="text-white/60 text-xs">מחשבון מס</div>
            <div className="text-white font-bold text-lg">Done1</div>
          </div>
        </div>

        {/* Calculator Display */}
        <div
          className={`bg-[#142850] rounded-xl p-5 mb-5 transition-all duration-500 ${calcBounce ? 'ring-2 ring-[#0090D5]' : ''} ${isCalculating ? 'animate-pulse' : ''}`}
        >
          <div
            className={`text-3xl font-bold text-center transition-all duration-500 ${
              calculatorValue.includes("✓") ? 'text-[#0090D5]' : 'text-white'
            }`}
            style={{ transform: `scale(${calcBounce ? 1.1 : 1})` }}
          >
            {calculatorValue || "..."}
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num, index) => (
            <div
              key={num}
              className={`aspect-square rounded-lg flex items-center justify-center text-white/60 text-lg font-medium transition-all duration-300`}
              style={{
                background: calcBounce && Math.random() > 0.6 ? 'rgba(0,144,213,0.5)' :
                           phase >= 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                transform: calcBounce && Math.random() > 0.7 ? 'scale(1.1)' : 'scale(1)',
                transitionDelay: `${index * 30}ms`,
              }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Status */}
        <div className={`mt-5 text-center transition-all duration-700 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ${
              phase >= 10 ? 'bg-[#0090D5]/30 text-[#0090D5]' : 'bg-white/10 text-white/60'
            }`}
            style={{ transform: `scale(${calcBounce ? 1.1 : 1})` }}
          >
            {phase >= 10 ? "חישוב הושלם ✓" : phase >= 1 ? "מחשב..." : ""}
          </span>
        </div>
      </div>

      {/* CSS for flying money animation */}
      <style jsx>{`
        @keyframes flyToBank {
          0% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateX(-100px) translateY(-30px) scale(1.5) rotate(-180deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-200px) translateY(0) scale(0.5) rotate(-360deg);
            opacity: 0;
          }
        }
        @keyframes flyToCalc {
          0% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateX(100px) translateY(-30px) scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translateX(200px) translateY(0) scale(0.5) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes flowRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
