import React, { useState } from "react";
import { InputBox } from "./components/index.js";
import useCurrencyInfo from "./hooks/useCurrencyInfo";

const App = () => {
  const [amount, setAmount] = useState<number>(0);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  const currencyInfo = useCurrencyInfo(from);
  const options: string[] = Object.keys(currencyInfo);

  const convert = () => {
    if (typeof amount === "number")
      setConvertedAmount(amount * currencyInfo[to]);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);

    setConvertedAmount(amount);
    setAmount(convertedAmount);
  };

  console.log(amount, convertedAmount);

  return (
    <div
      className="w-full h-screen flex flex-wrap justify-center items-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(https://images.pexels.com/photos/3521353/pexels-photo-3521353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
      }}
    >
      <div className="w-full">
        <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 bg-white/30 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert();
            }}
          >
            <div className="w-full mb-1">
              <InputBox
                label={"from"}
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                onAmountChange={(amount) => setAmount(amount)}
                selectedCurrency={from}
              />
            </div>
            <div className="relative w-full h-0.5">
              <button
                type="button"
                onClick={swap}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
              >
                Swap
              </button>
            </div>
            <div className="w-full mb-1">
              <InputBox
                label={"to"}
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setTo(currency)}
                onAmountChange={(amount) => setConvertedAmount(amount)}
                selectedCurrency={to}
                amountDisabled
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg"
            >
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
