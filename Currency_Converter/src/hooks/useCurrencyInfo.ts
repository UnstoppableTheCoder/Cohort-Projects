import { useEffect, useState } from "react";

type dataType = {
  [key: string]: number;
};

function useCurrencyInfo(currency: string): dataType {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`
    )
      .then((res) => res.json())
      .then((res) => setData(res[currency]))
      .catch((err) => console.error("Currency fetch error: ", err));
  }, [currency]);

  return data;
}

export default useCurrencyInfo;
