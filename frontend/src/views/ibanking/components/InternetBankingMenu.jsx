import React from "react";
import "../InternetBankingStyle.css"
import { useNavigate } from "react-router-dom";

const InternetBankingMenu = ({ setSelectedTab }) => {

    const navigate = useNavigate();

    const handleTabSelection = (selection) => {
        setSelectedTab(selection);
    }

    const goToHome = () => {
        navigate("/home");
    }

    return (
        <div className="left-menu normal-panel">
            <button
                className="left-menu-button"
                onClick={goToHome}
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