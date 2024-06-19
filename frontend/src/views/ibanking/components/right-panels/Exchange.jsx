import React from "react";
import "../../InternetBankingStyle.css"
import UsdEurChart from "./components/UsdEurChart";

const Exchange = () => {
    return (
        <div className="right-menu normal-panel">
            <h1 className="exchange-rate-title">Exchange money!</h1>
            <UsdEurChart />
        </div>
    )
}

export default Exchange;