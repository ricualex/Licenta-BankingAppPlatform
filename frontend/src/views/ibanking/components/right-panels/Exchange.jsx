import React from "react";
import "../../InternetBankingStyle.css"
import UsdEurChart from "./components/UsdEurChart";
import ExchangeRatesForm from "./components/ExchangeRatesForm";

const Exchange = () => {
    return (
        <div className="right-menu normal-panel">
            <div className="right-menu-left-panel" style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ color: "white", marginTop: "40px", marginLeft: "40px" }}>Payment scheduler</h1>
                <div className="exchange-form-panel" style={{marginLeft: "50px"}}>
                    <ExchangeRatesForm />
                </div>
            </div>
            <div className="right-menu-left-panel" style={{ display: "flex", flexDirection: "column", marginTop: "40px", marginLeft: "30px" }}>
                <UsdEurChart />
            </div>
        </div>

    )
}

export default Exchange;