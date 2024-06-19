import React from "react";
import "../../InternetBankingStyle.css"
import TransactionList from "./components/TransactionsList";

const Transactions = () => {
    return (
        <div className="right-menu normal-panel" style={{ display: "flex", flexDirection: "column" }}>
            <TransactionList />
        </div>
    )
}

export default Transactions;