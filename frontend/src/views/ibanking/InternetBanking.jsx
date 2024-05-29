import React from "react";
import "./InternetBankingStyle.css"
import { useState } from "react";
import InternetBankingMenu from "./components/InternetBankingMenu";
import MyAccount from "./components/right-panels/MyAccount";
import TransferMoney from "./components/right-panels/TransferMoney";
import ChangePassword from "./components/right-panels/ChangePassword";
import PaymentsScheduler from "./components/right-panels/PaymentsScheduler"
import Exchange from "./components/right-panels/Exchange";
import Transactions from "./components/right-panels/Transactions";
import MobileBanking from "./components/right-panels/MobileBanking";
import UserButton from "./components/UserButton";


const IBanking = () => {
    const [selectedTab, setSelectedTab] = useState("account");

    return (
        <div className="ibanking-page-wrapper">
            <div className="upper-div normal-panel">
                <UserButton></UserButton>
            </div>
            <InternetBankingMenu setSelectedTab={setSelectedTab} />
            {selectedTab === "account" && <MyAccount />}
            {selectedTab === "transfer" && <TransferMoney />}
            {selectedTab === "payments" && <PaymentsScheduler />}
            {selectedTab === "exchange" && <Exchange />}
            {selectedTab === "transactions" && <Transactions />}
            {selectedTab === "mobile_banking" && <MobileBanking />}
            {selectedTab === "change_password" && <ChangePassword />}
        </div>
    )
}

export default IBanking;