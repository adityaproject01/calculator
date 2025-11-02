import React, { useEffect, useState } from "react";
import "./component.css";
import { useNavigate } from "react-router-dom";

const Calculator = () => {
  const navigate = useNavigate();
  const [output, setOutput] = useState({
    monthlyExpenseAtRetirement: 0,
    annualExpenseAtRetirement: 0,
    corpusRequired: 0,
    monthlySIPRequired: 0,
    corpusToday: 0,
  });

  const [input, setInput] = useState({
    currentAge: Number,
    targetAge: Number,
    monthlyExpensive: Number,
    inflation: Number,
    rPre: Number,
    rPost: Number,
    deathAge: Number,
  });

  useEffect(() => {
    const checkOtpExpiry = () => {
      const verified = localStorage.getItem("otpVerified") === "true";
      const expiry = parseInt(localStorage.getItem("otpExpiry"), 10);
      const now = Date.now();

      if (!verified || !expiry || now > expiry) {
    
        localStorage.removeItem("otpVerified");
        localStorage.removeItem("otpExpiry");
        navigate("/", { replace: true });
      }
    };

    checkOtpExpiry();

    const interval = setInterval(checkOtpExpiry, 10 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);
  let [report, setReport] = useState();

  function handleSubmit(e) {
    e.preventDefault();
    let nCage = Number(input.currentAge);
    let nME = Number(input.monthlyExpensive);
    let nTA = Number(input.targetAge);
    let nATD = Number(input.deathAge);
    let nIR = parseFloat(input.inflation) / 100;
    let nRpre = parseFloat(input.rPre) / 100;
    let nRpost = parseFloat(input.rPost) / 100;

    let Y = nTA - nCage;
    let N = nATD - nTA;
    let M = Y * 12;
    let N_M = N * 12;
    let g_m = parseFloat((nIR / 12).toFixed(9));
    let r_m_pre = nRpre / 12;
    let r_m_post = parseFloat((nRpost / 12).toFixed(9));
    let monthlyExpenseAtRetirement = nME * Math.pow(1 + g_m, M);

    let annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;

    let ga = 1 + g_m;
    let gb = 1 + r_m_post;
    let gc = ga / gb;
    let gd = Math.pow(gc, N_M);
    let be = 1 - gd;
    let gf = r_m_post - g_m;
    let gg = be / gf;
    let gh = monthlyExpenseAtRetirement * gg;
    let gi = 1 + r_m_post;
    let corpusRequiredFull = gh * gi;

    let corpusRequired = Math.round(corpusRequiredFull);

    let ha = 1 + r_m_pre;
    let hb = Math.pow(ha, M);
    let hc = hb - 1;
    let hd = hc / r_m_pre;
    let he = hd * ha;
    let hf = corpusRequiredFull / he;
    let hg = hf * 100000;
    let monthlySIPRequired = Math.round(hg);

    let ia = Math.pow(ha, M);
    let ib = corpusRequired / ia;
    let corpusToday = Math.round(ib);

    setOutput({
      monthlyExpenseAtRetirement,
      annualExpenseAtRetirement,
      corpusRequired,
      monthlySIPRequired,
      corpusToday,
    });

    let reportArray = [];
    let startBalance = 0;
    for (let month = 1; month <= M; month++) {
      let contribution = hg;
      let interest = (startBalance + contribution) * r_m_pre;
      let endBalance = startBalance + interest + contribution;

      reportArray.push({
        month,
        startBalance,
        interest,
        contribution,
        endBalance,
      });

      startBalance = endBalance;
    }

    setReport(reportArray);
    console.log(reportArray);
  }
  function handleReset(e) {
    e.preventDefault();
    setOutput({
      monthlyExpenseAtRetirement: 0,
      annualExpenseAtRetirement: 0,
      corpusRequired: 0,
      monthlySIPRequired: 0,
      corpusToday: 0,
    });
    setInput({
      currentAge: Number,
      targetAge: Number,
      monthlyExpensive: Number,
      inflation: Number,
      rPre: Number,
      rPost: Number,
      deathAge: Number,
    });
    setReport();
  }
  function handlePositiveNumberChange(field, value) {
    if (value === "" || Number(value) > 0) {
      setInput((prev) => ({ ...prev, [field]: value }));
    }
  }
  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Retirement Planning Calculator</h1>
          <p>Plan your financial future with precision and confidence</p>
        </div>
      </header>

      <div className="calculator-grid">
        <div className="input-section">
          <div>
            <h2 className="section-title">Input Parameters</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentAge">
                Current Age
              </label>
              <input
                type="number"
                onChange={(e) =>
                  handlePositiveNumberChange("currentAge", e.target.value)
                }
                value={input.currentAge}
                className="form-input"
                placeholder="e.g., 30"
                required
              />
              <div className="error-message"></div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="retirementAge">
                Target Retirement Age
              </label>
              <input
                type="number"
                onChange={(e) =>
                  handlePositiveNumberChange("targetAge", e.target.value)
                }
                value={input.targetAge}
                className="form-input"
                placeholder="e.g., 55"
                required
              />
              <div className="error-message"></div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deathAge">
                Age till Death
              </label>
              <input
                type="number"
                onChange={(e) =>
                  handlePositiveNumberChange("deathAge", e.target.value)
                }
                value={input.deathAge}
                className="form-input"
                placeholder="e.g., 85"
                required
              />
              <div className="error-message"></div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="monthlyExpenses">
                Monthly Expenses (₹ Lakh)
              </label>
              <input
                type="number"
                onChange={(e) =>
                  handlePositiveNumberChange(
                    "monthlyExpensive",e.target.value
                  )
                }
                value={input.monthlyExpensive}
                step="0.01"
                className="form-input"
                placeholder="e.g., 1"
                required
              />
              <div className="error-message"></div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inflationRate">
                Inflation Rate (%)
              </label>
              <input
                type="number"
                onChange={(e) =>
                  handlePositiveNumberChange("inflation", e.target.value)
                }
                value={input.inflation}
                step="0.01"
                className="form-input"
                placeholder="e.g., 5"
                required
              />
              <div className="error-message"></div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="returnPreRetirement">
                Return Pre-Retirement (%)
              </label>
              <input
                type="number"
                onChange={(e) =>
                  handlePositiveNumberChange("rPre", e.target.value)
                }
                value={input.rPre}
                step="0.01"
                className="form-input"
                placeholder="e.g., 12"
                required
              />
              <div className="error-message"></div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="returnPostRetirement">
                Return Post-Retirement (%)
              </label>
              <input
                type="number"
                onChange={(e) =>
                  handlePositiveNumberChange("rPost", e.target.value)
                }
                value={input.rPost}
                step="0.01"
                className="form-input"
                placeholder="e.g., 8"
                required
              />
              <div className="error-message"></div>
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                Calculate
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary">
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="output-section">
          <div className="cards-grid">
            <div className="output-card card-1">
              <div className="card-label">Monthly Expense at Retirement</div>
              <div className="card-value">
                {Math.round(output.monthlyExpenseAtRetirement) || "--"}
              </div>
              <div className="card-unit">₹ Lakh</div>
            </div>

            <div className="output-card card-2">
              <div className="card-label">Annual Expense at Retirement</div>
              <div className="card-value">
                {Math.round(output.annualExpenseAtRetirement) || "--"}
              </div>
              <div className="card-unit">₹ Lakh</div>
            </div>

            <div className="output-card card-3">
              <div className="card-label">Corpus Required at Retirement</div>
              <div className="card-value">{output.corpusRequired || "--"}</div>
              <div className="card-unit">₹ Lakh</div>
            </div>

            <div className="output-card card-4">
              <div className="card-label">Monthly SIP Required</div>
              <div className="card-value">
                {output.monthlySIPRequired || "--"}
              </div>
              <div className="card-unit">₹ Lakh</div>
            </div>

            <div className="output-card card-5">
              <div className="card-label">Total Corpus Required Today</div>
              <div className="card-value">{output.corpusToday || "--"}</div>
              <div className="card-unit">₹ Lakh</div>
            </div>
          </div>

          <div className="table-section">
            <h3 className="table-title">
              Accumulation Schedule — Monthly (Annuity-Due)
            </h3>
            <div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Start Balance</th>
                    <th>Interest</th>
                    <th>Contribution (SIP)</th>
                    <th>End Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.map((ele, index) => (
                    <tr key={index}>
                      <td>{ele.month}</td>
                      <td>{ele.startBalance.toFixed(5)}</td>
                      <td>{ele.interest.toFixed(5)}</td>
                      <td>{ele.contribution.toFixed(5)}</td>
                      <td>{ele.endBalance.toFixed(5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
