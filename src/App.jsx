import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calculator, 
  Percent, 
  Receipt, 
  CreditCard, 
  Users, 
  History, 
  Settings, 
  Home, 
  ArrowRightLeft, 
  ChevronRight, 
  Trash2, 
  Share2, 
  Star, 
  MessageSquare,
  Moon,
  Sun,
  Delete,
  X,
  AlertCircle,
  TrendingUp,
  Fuel,
  Coins,
  DollarSign,
  Clock
} from 'lucide-react';

const APP_ID = 'smart-money-v1';

// SAFE MATH PARSER for the calculator
const safeEvaluate = (input) => {
  try {
    const tokens = input.match(/\d+\.\d+|\d+|[+\-*/()]/g);
    if (!tokens) return "";
    let index = 0;
    const parsePrimary = () => {
      let token = tokens[index++];
      if (token === "(") {
        let result = parseExpression();
        index++; 
        return result;
      }
      return parseFloat(token);
    };
    const parseMultiplication = () => {
      let left = parsePrimary();
      while (tokens[index] === "*" || tokens[index] === "/") {
        let op = tokens[index++];
        let right = parsePrimary();
        if (op === "*") left *= right;
        else {
          if (right === 0) throw new Error("DivByZero");
          left /= right;
        }
      }
      return left;
    };
    const parseExpression = () => {
      let left = parseMultiplication();
      while (tokens[index] === "+" || tokens[index] === "-") {
        let op = tokens[index++];
        let right = parseMultiplication();
        if (op === "+") left += right;
        else left -= right;
      }
      return left;
    };
    const finalValue = parseExpression();
    if (isNaN(finalValue) || !isFinite(finalValue)) return "Error";
    return Number(finalValue.toFixed(8)).toString();
  } catch (e) {
    return "Error";
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dailySavingTip, setDailySavingTip] = useState("");

  // --- MARKET DATA (UPDATE THIS OBJECT ANY TIME) ---
  const [marketData] = useState({
    lastUpdated: "May 13, 2026",
    rates: [
      { id: 'gold', label: 'Gold (24K/10g)', value: '₹1,53,497', trend: '+1.2%', icon: <TrendingUp size={16} />, color: 'text-amber-500' },
      { id: 'petrol', label: 'Petrol (Delhi)', value: '₹94.77', trend: '-0.05%', icon: <Fuel size={16} />, color: 'text-blue-500' },
      { id: 'forex', label: 'USD to INR', value: '₹95.67', trend: '+0.12%', icon: <DollarSign size={16} />, color: 'text-emerald-500' },
      { id: 'crypto', label: 'Bitcoin (BTC)', value: '₹77,02,688', trend: '+4.5%', icon: <Coins size={16} />, color: 'text-orange-500' },
    ]
  });

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(`${APP_ID}_history`);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error("Failed to parse history", e);
    }
    const savedTheme = localStorage.getItem(`${APP_ID}_theme`);
    if (savedTheme === 'dark') setIsDarkMode(true);
    updateSavingInsight();
  }, []);

  const updateSavingInsight = () => {
    const amounts = [10, 20, 50, 100, 200, 500];
    const daily = amounts[Math.floor(Math.random() * amounts.length)];
    const yearly = daily * 365;
    setDailySavingTip(`💡 Save ₹${daily} daily to have ₹${yearly.toLocaleString('en-IN')} by next year!`);
  };

  const saveToHistory = (type, input, result) => {
    if (!result || result === "Error") return;
    const newItem = {
      id: crypto.randomUUID(),
      type,
      input,
      result,
      date: new Date().toLocaleString(),
    };
    const updated = [newItem, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem(`${APP_ID}_history`, JSON.stringify(updated));
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem(`${APP_ID}_history`, JSON.stringify(updated));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem(`${APP_ID}_theme`, !isDarkMode ? 'dark' : 'light');
  };

  const HomeView = () => (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Live Market Dashboard Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-5 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className={`font-bold text-sm uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Live Market</h2>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock size={10} /> {marketData.lastUpdated}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {marketData.rates.map((rate) => (
            <div key={rate.id} className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-3 rounded-2xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={rate.color}>{rate.icon}</span>
                <span className="text-[10px] font-medium text-gray-500 truncate">{rate.label}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{rate.value}</span>
                <span className={`text-[9px] font-bold ${rate.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {rate.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Branding Card */}
      <div className="bg-green-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Smart Money Assistant</h1>
          <p className="opacity-90">Quick tools for daily money calculations</p>
        </div>
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white opacity-10 rounded-full"></div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'discount', label: 'Discount', icon: <Percent />, color: 'bg-orange-100 text-orange-600' },
          { id: 'gst', label: 'GST Tax', icon: <Receipt />, color: 'bg-blue-100 text-blue-600' },
          { id: 'emi', label: 'EMI Calc', icon: <CreditCard />, color: 'bg-purple-100 text-purple-600' },
          { id: 'split', label: 'Split Bill', icon: <Users />, color: 'bg-teal-100 text-teal-600' },
          { id: 'currency', label: 'Currency', icon: <ArrowRightLeft />, color: 'bg-pink-100 text-pink-600' },
          { id: 'calc', label: 'Calculator', icon: <Calculator />, color: 'bg-green-100 text-green-600' },
        ].map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTab(tool.id)}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-5 rounded-2xl shadow-sm border border-transparent hover:border-green-500 transition-all flex flex-col items-center gap-3`}
          >
            <div className={`p-3 rounded-xl ${tool.color}`}>{tool.icon}</div>
            <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{tool.label}</span>
          </button>
        ))}
      </div>
      
      {/* Recent History Card */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent History</h2>
          <button onClick={() => setActiveTab('history')} className="text-green-600 text-sm font-medium">View All</button>
        </div>
        <div className="flex flex-col gap-3">
          {history.length === 0 ? (
            <div className={`p-4 rounded-xl text-center border-2 border-dashed ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
              No calculations yet
            </div>
          ) : (
            history.slice(0, 3).map((item) => (
              <div key={item.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-sm flex justify-between items-center`}>
                <div>
                  <p className="text-xs text-green-500 font-bold uppercase">{item.type}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.input}</p>
                </div>
                <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.result}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const StandardCalculator = () => {
    const [calcInput, setCalcInput] = useState("");
    const [calcResult, setCalcResult] = useState("");

    const handleBtn = (val) => {
      if (val === "C") {
        setCalcInput("");
        setCalcResult("");
      } else if (val === "DEL") {
        setCalcInput(calcInput.slice(0, -1));
      } else if (val === "=") {
        const res = safeEvaluate(calcInput);
        setCalcResult(res);
        if (res !== "Error" && calcInput !== "") {
          saveToHistory("Calc", calcInput, res);
        }
      } else {
        const lastChar = calcInput.slice(-1);
        const operators = ["+", "-", "*", "/"];
        if (operators.includes(val) && operators.includes(lastChar)) return;
        setCalcInput(calcInput + val);
      }
    };

    return (
      <div className="flex flex-col h-full gap-4 pb-20">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} p-6 rounded-3xl border-2 text-right min-h-[160px] flex flex-col justify-end gap-2`}>
          <div className={`text-xl overflow-hidden text-ellipsis ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{calcInput || "0"}</div>
          <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{calcResult || " "}</div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {["C", "DEL", "(", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", ")", "="].map((btn) => (
            <button
              key={btn}
              onClick={() => handleBtn(btn)}
              className={`text-xl font-bold h-16 rounded-2xl transition-all shadow-sm active:scale-95
                ${btn === "=" ? 'bg-green-600 text-white' : 
                  ["/", "*", "-", "+", "C", "DEL"].includes(btn) ? 'bg-green-50 text-green-600' : 
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}
            >
              {btn === "DEL" ? <Delete className="mx-auto" /> : btn}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const DiscountCalc = () => {
    const [price, setPrice] = useState("");
    const [perc, setPerc] = useState("");
    const [res, setRes] = useState(null);

    const calculate = () => {
      const p = parseFloat(price);
      const d = parseFloat(perc);
      if (isNaN(p) || isNaN(d)) return;
      const off = (p * d) / 100;
      const final = p - off;
      setRes({ off: off.toFixed(2), final: final.toFixed(2) });
      saveToHistory("Discount", `₹${p} - ${d}%`, `₹${final.toFixed(2)}`);
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Discount Calculator</h2>
        <div className="space-y-4">
          <input type="number" placeholder="Original Price (₹)" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={price} onChange={e => setPrice(e.target.value)} />
          <input type="number" placeholder="Discount (%)" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={perc} onChange={e => setPerc(e.target.value)} />
          <button onClick={calculate} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold">Calculate</button>
        </div>
        {res && (
          <div className="bg-green-50 p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between text-green-700 font-medium"><span>You Save</span><span>₹{res.off}</span></div>
            <div className="border-t border-green-200 pt-3 flex justify-between items-center text-green-800 font-black text-2xl"><span>Final</span><span>₹{res.final}</span></div>
          </div>
        )}
      </div>
    );
  };

  const GSTCalc = () => {
    const [amount, setAmount] = useState("");
    const [rate, setRate] = useState("18");
    const [res, setRes] = useState(null);

    const calculate = () => {
      const a = parseFloat(amount);
      const r = parseFloat(rate);
      if (isNaN(a) || isNaN(r)) return;
      const gst = (a * r) / 100;
      const total = a + gst;
      setRes({ gst: gst.toFixed(2), total: total.toFixed(2) });
      saveToHistory("GST", `₹${a} @ ${r}%`, `₹${total.toFixed(2)}`);
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>GST Calculator</h2>
        <div className="space-y-4">
          <input type="number" placeholder="Amount (₹)" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={amount} onChange={e => setAmount(e.target.value)} />
          <div className="grid grid-cols-4 gap-2">
            {["5", "12", "18", "28"].map(v => (
              <button key={v} onClick={() => setRate(v)} className={`p-3 rounded-xl font-bold ${rate === v ? 'bg-green-600 text-white' : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100'}`}>{v}%</button>
            ))}
          </div>
          <button onClick={calculate} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold">Calculate GST</button>
        </div>
        {res && (
          <div className="bg-blue-50 p-6 rounded-2xl flex flex-col gap-4 text-blue-800">
            <div className="flex justify-between"><span>GST Amount</span><span className="font-bold">₹{res.gst}</span></div>
            <div className="border-t border-blue-200 pt-3 flex justify-between font-black text-2xl"><span>Total</span><span>₹{res.total}</span></div>
          </div>
        )}
      </div>
    );
  };

  const EMICalc = () => {
    const [p, setP] = useState("");
    const [r, setR] = useState("");
    const [n, setN] = useState("");
    const [res, setRes] = useState(null);

    const calculate = () => {
      const principal = parseFloat(p);
      const rate = parseFloat(r) / 12 / 100;
      const months = parseFloat(n);
      if (isNaN(principal) || isNaN(rate) || isNaN(months) || months <= 0) return;
      const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      setRes({ emi: emi.toFixed(0), totalPay: (emi * months).toFixed(0) });
      saveToHistory("EMI", `₹${principal} / ${months}M`, `₹${emi.toFixed(0)}/mo`);
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>EMI Calculator</h2>
        <div className="space-y-4">
          <input type="number" placeholder="Loan Amount (₹)" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={p} onChange={e => setP(e.target.value)} />
          <input type="number" placeholder="Interest Rate (%)" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={r} onChange={e => setR(e.target.value)} />
          <input type="number" placeholder="Months" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={n} onChange={e => setN(e.target.value)} />
          <button onClick={calculate} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold">Calculate EMI</button>
        </div>
        {res && (
          <div className="bg-purple-50 p-6 rounded-2xl space-y-3 text-purple-800">
            <div className="flex justify-between"><span>Monthly EMI</span><span className="font-black text-xl">₹{res.emi}</span></div>
            <div className="flex justify-between border-t border-purple-200 pt-2"><span>Total Payment</span><span>₹{res.totalPay}</span></div>
          </div>
        )}
      </div>
    );
  };

  const SplitBillCalc = () => {
    const [bill, setBill] = useState("");
    const [people, setPeople] = useState("");
    const [res, setRes] = useState(null);

    const calculate = () => {
      const b = parseFloat(bill);
      const p = parseInt(people);
      if (isNaN(b) || isNaN(p) || p <= 0) return;
      const perPerson = b / p;
      setRes(perPerson.toFixed(2));
      saveToHistory("Split", `₹${b} / ${p} pax`, `₹${perPerson.toFixed(2)} ea`);
    };

    return (
      <div className="flex flex-col gap-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Split Bill</h2>
        <div className="space-y-4">
          <input type="number" placeholder="Total Bill (₹)" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={bill} onChange={e => setBill(e.target.value)} />
          <input type="number" placeholder="Number of People" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={people} onChange={e => setPeople(e.target.value)} />
          <button onClick={calculate} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold">Split Now</button>
        </div>
        {res && (
          <div className="bg-teal-50 p-8 rounded-3xl text-center border-2 border-teal-100">
            <p className="text-teal-600 font-medium">Each Person Pays</p>
            <p className="text-teal-900 font-black text-4xl mt-2">₹{res}</p>
          </div>
        )}
      </div>
    );
  };

  const CurrencyConverter = () => {
    const [inr, setInr] = useState("");
    const [currency, setCurrency] = useState("USD");
    const rates = { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.82 };
    
    const converted = useMemo(() => {
      const val = parseFloat(inr);
      if (isNaN(val)) return "0.00";
      return (val * rates[currency]).toFixed(2);
    }, [inr, currency]);

    return (
      <div className="flex flex-col gap-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Currency Converter</h2>
        <div className="space-y-4">
          <input type="number" placeholder="Amount in INR (₹)" className={`w-full p-4 rounded-xl border-2 outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'}`} value={inr} onChange={e => setInr(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(rates).map(c => (
              <button key={c} onClick={() => setCurrency(c)} className={`p-3 rounded-xl font-bold border-2 ${currency === c ? 'bg-pink-600 text-white' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>{c}</button>
            ))}
          </div>
          <div className="bg-pink-50 p-8 rounded-3xl text-center text-pink-900 font-black text-4xl">
            {converted} {currency}
          </div>
          <button onClick={() => saveToHistory("FX", `₹${inr} to ${currency}`, `${converted} ${currency}`)} className="w-full bg-pink-100 text-pink-700 py-3 rounded-xl font-bold flex justify-center gap-2"><History size={18}/> Save</button>
        </div>
      </div>
    );
  };

  const HistoryView = () => (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Saved Calculations</h2>
        <button onClick={() => { setHistory([]); localStorage.removeItem(`${APP_ID}_history`); }} className="text-red-500 flex items-center gap-1 text-sm font-medium"><Trash2 size={16} /> Clear All</button>
      </div>
      <div className="flex flex-col gap-3 pb-24">
        {history.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4 text-gray-400"><History size={64} strokeWidth={1} /><p>No history</p></div>
        ) : (
          history.map(item => (
            <div key={item.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 rounded-2xl shadow-sm border flex items-center justify-between`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 uppercase">{item.type}</span><span className="text-[10px] text-gray-400">{item.date}</span></div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.input}</p>
                <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.result}</p>
              </div>
              <button onClick={() => deleteHistoryItem(item.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={20} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="flex flex-col gap-6">
      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h2>
      
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl overflow-hidden shadow-sm`}>
        <div className={`p-5 flex justify-between items-center border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-900 text-yellow-500' : 'bg-yellow-50 text-yellow-600'}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</div>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Dark Mode</span>
          </div>
          <button onClick={toggleTheme} className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-green-600' : 'bg-gray-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} /></button>
        </div>

        {[
          { icon: <Star />, label: 'Rate App', color: 'text-orange-500', action: () => {} },
          { icon: <Share2 />, label: 'Share App', color: 'text-blue-500', action: () => {} },
          { icon: <MessageSquare />, label: 'Send Feedback', color: 'text-purple-500', action: () => {} },
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={item.action}
            className={`w-full p-5 flex justify-between items-center hover:bg-gray-50 transition-colors border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-50'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${item.color}`}>{item.icon}</div>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        ))}
      </div>

      <div className="mt-4 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-start gap-4">
        <AlertCircle className="text-green-600 shrink-0" />
        <div>
          <h4 className="text-green-800 font-bold">Privacy First</h4>
          <p className="text-green-600 text-sm mt-1">Calculations are stored locally. No personal data is sent to servers.</p>
        </div>
      </div>
      <p className="text-center text-gray-400 text-xs mt-10 pb-20">Smart Money Assistant v1.1.0</p>
    </div>
  );

  const renderView = () => {
    switch(activeTab) {
      case 'home': return <HomeView />;
      case 'calc': return <StandardCalculator />;
      case 'discount': return <DiscountCalc />;
      case 'gst': return <GSTCalc />;
      case 'emi': return <EMICalc />;
      case 'split': return <SplitBillCalc />;
      case 'currency': return <CurrencyConverter />;
      case 'history': return <HistoryView />;
      case 'settings': return <SettingsView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#F8FAFC]'} pb-24 transition-colors`}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-30 px-6 py-4 flex justify-between items-center backdrop-blur-md ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-100'} border-b`}>
        {activeTab !== 'home' ? (
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-green-600 font-bold"><X size={24} /> Close</button>
        ) : (
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white"><Calculator size={18} /></div><span className={`font-black text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SmartPay</span></div>
        )}
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('history')} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}><History size={22} /></button>
          <button onClick={toggleTheme} className={isDarkMode ? 'text-yellow-400' : 'text-gray-500'}>{isDarkMode ? <Sun size={22} /> : <Moon size={22} />}</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto px-6 pt-6">{renderView()}</div>

      {/* Daily Tip Floating Bar */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pointer-events-none">
        <div className="max-w-md mx-auto bg-green-900 text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 opacity-95 text-xs font-bold pointer-events-auto">
          <div className="bg-white/20 p-2 rounded-lg">🚀</div>
          <p>{dailySavingTip}</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-t px-6 py-3 pb-6 flex justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]`}>
        {[
          { id: 'home', icon: <Home />, label: 'Home' },
          { id: 'calc', icon: <Calculator />, label: 'Calc' },
          { id: 'history', icon: <History />, label: 'History' },
          { id: 'settings', icon: <Settings />, label: 'Settings' }
        ].map(nav => (
          <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === nav.id ? 'text-green-600 scale-110' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {React.cloneElement(nav.icon, { size: 24, strokeWidth: activeTab === nav.id ? 2.5 : 2 })}
            <span className="text-[10px] font-bold uppercase">{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
