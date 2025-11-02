import React, { useState } from "react";
import "./component.css";
import profileImg from "./profile/b_causal_smile.png";
const Calculator = () => {
  const [output, setOutput] = useState({
    monthlyExpenseAtRetirement: 0,
    annualExpenseAtRetirement: 0,
    corpusRequired: 0,
    monthlySIPRequired: 0,
    corpusToday: 0,
  });

  const [input, setInput] = useState({
    currentAge: 30,
    targetAge: 55,
    monthlyExpensive: 1,
    inflation: 5,
    rPre: 12,
    rPost: 8,
    deathAge: 85,
  });
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
    let g = 1 + g_m;

    let monthlyExpenseAtRetirement = nME * Math.pow(g, M);
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
    let corpusRequired = Math.round(gh * gi);

    let ha = 1 + r_m_pre;
    let hb = Math.pow(ha, M);
    let hc = hb - 1;
    let hd = hc / r_m_pre;
    let he = hd * ha; 
    let hf = corpusRequired / he;
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
  }

  return (
    <div className="container">
      <div className="header">
        {/* <img src={profileImg} className="profileImg"/> */}
      </div>
      <main>
        <div className="inputsSection">
          <div className="formLeft">
            <h2 className="section-title">Finance Calculate</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="current-age">Current Age (CA)</label>
                <input
                  type="number"
                  value={input.currentAge}
                  onChange={(e) =>
                    setInput({ ...input, currentAge: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="retirement-age">
                  Target Retirement Age (TRA)
                </label>
                <input
                  type="number"
                  value={input.targetAge}
                  onChange={(e) =>
                    setInput({ ...input, targetAge: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="death-age">Age till Death (ATD)</label>
                <input
                  type="number"
                  value={input.deathAge}
                  onChange={(e) =>
                    setInput({ ...input, deathAge: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="monthly-expenses">
                  Monthly Expenses (ME) in ₹ Lakh
                </label>
                <input
                  type="number"
                  value={input.monthlyExpensive}
                  onChange={(e) =>
                    setInput({ ...input, monthlyExpensive: e.target.value })
                  }
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="inflation-rate">
                  Inflation Rate i (per year, in %)
                </label>
                <input
                  type="number"
                  value={input.inflation}
                  onChange={(e) =>
                    setInput({ ...input, inflation: e.target.value })
                  }
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="return-pre">
                  Return pre-retirement r_pre (per year, in %)
                </label>
                <input
                  type="number"
                  value={input.rPre}
                  onChange={(e) => setInput({ ...input, rPre: e.target.value })}
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="return-post">
                  Return post-retirement r_post (per year, in %)
                </label>
                <input
                  type="number"
                  value={input.rPost}
                  onChange={(e) =>
                    setInput({ ...input, rPost: e.target.value })
                  }
                  step="0.1"
                />
              </div>
              <div className="formSubmit">
                <input type="reset" className="resetBtn" />
                <input type="submit" className="submitBtn" />
              </div>
              <div>{output.monthlyExpenseAtRetirement || "-"}</div>
            </form>
          </div>
        </div>
        <div className="formRight">
          <div className="table-container">
            <h3 className="table-title">
              Accumulation Schedule — Monthly (Annuity-Due)
            </h3>
            <table>
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
                <tr>
                  <td>1</td>
                  <td>0.00</td>
                  <td>0.00</td>
                  <td>45,230</td>
                  <td>45,230</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>45,230</td>
                  <td>452</td>
                  <td>45,230</td>
                  <td>90,912</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>90,912</td>
                  <td>909</td>
                  <td>45,230</td>
                  <td>1,37,051</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>1,37,051</td>
                  <td>1,371</td>
                  <td>45,230</td>
                  <td>1,83,652</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>1,83,652</td>
                  <td>1,837</td>
                  <td>45,230</td>
                  <td>2,30,719</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>2,30,719</td>
                  <td>2,307</td>
                  <td>45,230</td>
                  <td>2,78,256</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="outputs-section">
            <div className="output-card">
              <div className="output-label">Monthly Expenses at Retirement</div>
              <div className="">{Math.round(output.monthlyExpenseAtRetirement) || ""}</div>
          
              <div className="output-unit">₹ Lakh</div>
            </div>

            <div className="output-card">
              <div className="output-label">Annual Expenses at Retirement</div>
              <div className="">{Math.round(output.annualExpenseAtRetirement) || ""}</div>
              <div className="output-unit">₹ Lakh</div>
            </div>

            <div className="output-card">
              <div className="output-label">Corpus Required at Retirement</div>
              <div className="">{output.corpusRequired || ""}</div>
              <div className="output-unit">₹ Lakh</div>
            </div>

            <div className="output-card">
              <div className="output-label">Monthly SIP Required</div>
              <div className="">{output.monthlySIPRequired || ""}</div>
              <div className="output-unit">₹</div>
            </div>

            <div className="output-card">
              <div className="output-label">Total Corpus Required Today</div>
              <div className="">{output.corpusToday || ""}</div>
              <div className="output-unit">₹ Lakh</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calculator;
