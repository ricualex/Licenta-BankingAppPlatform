import React from "react";
import "./HomeStyle.css"
import Navbar from "../../components/navbar/Navbar";
import HomeCard from "../../components/home-card/HomeCard";
import mobileBankingCardImage from '../../assets/mobilebanking.png';
import loanCalculatorCardImage from "../../assets/card-image-loan-calculator.png"
import virtualCardsCardImage from "../../assets/virtual-cards-logo.png"
import ExchangeRateBar from "../../components/exchange-rate-bar/ExchangeRateBar";


const Home = () => {
    const cardsData = [
        {
            "image": mobileBankingCardImage,
            "name": "mobileApp",
            "title": "Internet banking with Mobile App",
            "text": "Stay updated on your finances anytime, anywhere. Track your spending and account balance effortlessly with our mobile app..."

        },
        {
            "image": loanCalculatorCardImage,
            "name": "loan-calculator",
            "title": "Simulate a loan using our calculator",
            "text": "Unlock Your Financial Freedom Today! What kind of loan suites you best?"
        },
        {

            "image": virtualCardsCardImage,
            "name": "virtual-cards",
            "title": "Virtual cards, directly from the app",
            "text": "Create one virtual card to secure your payments fast and efortless!"

        },
    ]
    return (
        <div className="home-wrapper">
            <Navbar />
            <div className="home-cards">
                {
                    Object.keys(cardsData).map((key) => {
                        return <HomeCard key={key} cardImage={cardsData[key].image} cardTitle={cardsData[key].title} cardText={cardsData[key].text} />
                    })
                }
            </div>
            <div className="home-rates">
                <ExchangeRateBar />
            </div>


        </div>
    )
}

export default Home