import React, { useState } from 'react';
import './CreditCalculator.css';

function CreditCalculator() {
  const [loanAmount, setLoanAmount] = useState(0);
  const [annualInterestRate, setAnnualInterestRate] = useState(14.66);
  const [loanDuration, setLoanDuration] = useState(0);
  const [currency, setCurrency] = useState('RON');
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const handleLoanAmountChange = (e) => {
    const value = Math.max(0, e.target.value);
    setLoanAmount(value);
  };

  const handleInterestRateChange = (e) => {
    const value = Math.max(12, e.target.value);
    setAnnualInterestRate(value);
  };

  const handleLoanDurationChange = (e) => {
    const value = Math.max(0, e.target.value);
    setLoanDuration(value);
  };

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const calculatedInterest = parseFloat(annualInterestRate) / 100 / 12;
    const calculatedPayments = parseFloat(loanDuration) * 12;

    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      setMonthlyPayment(monthly.toFixed(2));
      setTotalPayment((monthly * calculatedPayments).toFixed(2));
      setTotalInterest((monthly * calculatedPayments - principal).toFixed(2));
    } else {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
    }
  };

  return (
    <div className="credit-calculator">
      <h1 className="credit-calculator-title">Loan Calculator</h1>
      <div className="form-group">
        <label className="form-label">Loan Amount:</label>
        <input
          type="number"
          value={loanAmount}
          onChange={handleLoanAmountChange}
          min="0"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Annual Interest Rate (%):</label>
        <input
          type="number"
          value={annualInterestRate}
          onChange={handleInterestRateChange}
          min="0"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Loan Duration (Years):</label>
        <input
          type="number"
          value={loanDuration}
          onChange={handleLoanDurationChange}
          min="0"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Currency:</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="form-input"
        >
          <option value="RON">RON</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <button onClick={calculateLoan} className="calculate-button">Calculate</button>
      <div className="results">
        <h3 className="results-title">Results</h3>
        <p className="results-text">Monthly Payment: {monthlyPayment} {currency}</p>
        <p className="results-text">Total Payment: {totalPayment} {currency}</p>
        <p className="results-text">Total Interest: {totalInterest} {currency}</p>
      </div>
    </div>
  );
}

export default CreditCalculator;
