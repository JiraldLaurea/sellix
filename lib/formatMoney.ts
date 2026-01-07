import Dinero from "dinero.js";

export function formatMoney(cents: number) {
    return Dinero({
        amount: cents,
        currency: "USD",
    }).toFormat("$0,0.00");
}
