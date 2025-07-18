import { useState } from 'react';
import './App.css';

function App() {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTerm, setLoanTerm] = useState(12);
  const [amortizationData, setAmortizationData] = useState([]);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 100 / 12;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return emi.toFixed(2);
  };

  const generateAmortizationSchedule = () => {
    const monthlyRate = interestRate / 100 / 12;
    const emi = calculateEMI();
    let balance = principal;
    const schedule = [];

    for (let month = 1; month <= loanTerm; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        totalPayment: emi,
        remainingBalance: Math.abs(balance).toFixed(2)
      });
    }

    setAmortizationData(schedule);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateAmortizationSchedule();
  };

  // Format numbers with Indian comma separators
  const formatINR = (amount) => {
    return '₹' + parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="app-container">
      <h1>Loan EMI Amortization Calculator</h1>
      
      <div className="calculator-container">
        <form onSubmit={handleSubmit} className="calculator-form">
          <div className="form-group">
            <label htmlFor="principal">Loan Amount (₹)</label>
            <input
              type="number"
              id="principal"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value))}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="interestRate">Annual Interest Rate (%)</label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              min="0.1"
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="loanTerm">Loan Term (months)</label>
            <input
              type="number"
              id="loanTerm"
              value={loanTerm}
              onChange={(e) => setLoanTerm(parseInt(e.target.value))}
              min="1"
              required
            />
          </div>
          
          <button type="submit" className="calculate-btn">Calculate EMI</button>
        </form>
        
        <div className="results-section">
          <h2>Loan Summary</h2>
          <div className="summary-card">
            <div className="summary-item">
              <span>Monthly EMI:</span>
              <span>{formatINR(calculateEMI())}</span>
            </div>
            <div className="summary-item">
              <span>Total Interest:</span>
              <span>{formatINR(calculateEMI() * loanTerm - principal)}</span>
            </div>
            <div className="summary-item">
              <span>Total Payment:</span>
              <span>{formatINR(calculateEMI() * loanTerm)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {amortizationData.length > 0 && (
        <div className="amortization-table-container">
          <h2>Amortization Schedule</h2>
          <div className="table-scroll">
            <table className="amortization-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Total Payment</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationData.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{formatINR(row.principalPayment)}</td>
                    <td>{formatINR(row.interestPayment)}</td>
                    <td>{formatINR(row.totalPayment)}</td>
                    <td>{formatINR(row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;