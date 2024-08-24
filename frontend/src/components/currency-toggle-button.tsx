import { CurrencyCtx } from "@/context/currency-provider";
import { useContext } from "react";
import { Switch } from "./ui/switch";

export default function CurrencyToggleButton () {
    const { toggleCurrency } = useContext(CurrencyCtx);
  
    return (
      <Switch
        onClick={toggleCurrency}
        className="mt-auto"
      >
      </Switch>
    );
  };