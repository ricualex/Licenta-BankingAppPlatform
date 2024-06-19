import React from "react";
import "../../InternetBankingStyle.css"
import SchedulePaymentForm from "./components/SchedulePaymentsForm";
import SchedulerList from "./components/SchedulerList";

const PaymentsScheduler = () => {
    return (
        <div className="right-menu normal-panel" style={{ display: "flex" }}>
            <div className="right-menu-left-panel" style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ color: "white", marginTop: "40px", marginLeft: "40px" }}>Payment scheduler</h1>
                <SchedulePaymentForm />
            </div>
            <div className="right-menu-left-panel" style={{ display: "flex", flexDirection: "column", marginLeft: "30px"}}>
                <SchedulerList />
            </div>
        </div>
    )
}

export default PaymentsScheduler;