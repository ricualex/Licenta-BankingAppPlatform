import React from "react";
import "../InternetBankingStyle.css"
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import HistoryIcon from '@mui/icons-material/History';
import KeyIcon from '@mui/icons-material/Key';

const InternetBankingMenu = ({ setSelectedTab }) => {

    const navigate = useNavigate();

    const handleTabSelection = (selection) => {
        setSelectedTab(selection);
    }

    const goToHome = () => {
        navigate("/home");
    }

    const menuButtonStyle = {
        color: 'white',
        fontSize: "1vw",
        borderBottom: "3px solid rgb(3, 0, 28)",
        justifyContent: "start",
        allignItems: "start",
        marginLeft: "10px",
        textTransform: "none",
        '& .MuiButton-startIcon': {
            color: 'white',
        },
        '&:hover': {
            backgroundColor: "rgb(3, 0, 28)",
        },
    }

    return (
        <div className="left-menu normal-panel">
            <Button className="left-menu-button"
                startIcon={<HomeIcon />}
                onClick={goToHome}
                sx={menuButtonStyle}
            >
                Home
            </Button>
            <Button className="left-menu-button"
                startIcon={<AccountBalanceWalletIcon />}
                onClick={() => handleTabSelection("account")}
                sx={menuButtonStyle}
            >
                My Account
            </Button>
            <Button className="left-menu-button"
                startIcon={<SwapHorizIcon />}
                onClick={() => handleTabSelection("transfer")}
                sx={menuButtonStyle}
            >
                Transfer money
            </Button>
            <Button className="left-menu-button"
                startIcon={<ScheduleIcon />}
                onClick={() => handleTabSelection("payments")}
                sx={menuButtonStyle}
            >
                Payments scheduler
            </Button>
            <Button className="left-menu-button"
                startIcon={<CurrencyExchangeIcon />}
                onClick={() => handleTabSelection("exchange")}
                sx={menuButtonStyle}
            >
                Exchange
            </Button>
            <Button className="left-menu-button"
                startIcon={<HistoryIcon />}
                onClick={() => handleTabSelection("transactions")}
                sx={menuButtonStyle}
            >
                Transactions
            </Button>
            <Button className="left-menu-button"
                startIcon={<InstallMobileIcon />}
                onClick={() => handleTabSelection("mobile_banking")}
                sx={menuButtonStyle}
            >
                Mobile banking
            </Button>
            <Button className="left-menu-button"
                startIcon={<KeyIcon />}
                onClick={() => handleTabSelection("change_password")}
                sx={menuButtonStyle}
            >
                Change password
            </Button>
        </div>
    )
}

export default InternetBankingMenu;