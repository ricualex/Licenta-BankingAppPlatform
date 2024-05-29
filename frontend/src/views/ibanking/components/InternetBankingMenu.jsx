import React from "react";
import "../InternetBankingStyle.css"

const InternetBankingMenu = ({ setSelectedTab }) => {

    const handleTabSelection = (selection) => {
        setSelectedTab(selection);
    }

    return (
        <div className="left-menu normal-panel">
            <button
                className="left-menu-button"
            >
                Home
            </button>
            <button
                className="left-menu-button"
                onClick={() => handleTabSelection("account")}
            >
                My Account
            </button>
            <button
                className="left-menu-button"
                onClick={() => handleTabSelection("transfer")}>
                Transfer money
            </button>
            <button
                className="left-menu-button"
                onClick={() => handleTabSelection("payments")}
            >
                Payments scheduler
            </button>
            <button
                className="left-menu-button"
                onClick={() => handleTabSelection("exchange")}
            >
                Exchange
            </button>
            <button
                className="left-menu-button"
                onClick={() => handleTabSelection("transactions")}
            >
                Transactions
            </button>
            <button
                className="left-menu-button"
                onClick={() => handleTabSelection("mobile_banking")}
            >
                Mobile banking
            </button>
            <button
                className="left-menu-button"
                onClick={() => handleTabSelection("change_password")}
            >
                Change password
            </button>
        </div>
    )
}

export default InternetBankingMenu;