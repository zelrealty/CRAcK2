import React, { useState } from "react";
import "./App.css";

// Google Sheets endpoint
const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyB548qtWGscUlP-mS3OQSC1ZS3jtteLTUEK4HBAK7oBgQ3Mnli76Yb_T0LuOpgmFZ4/exec";

type Step = 0 | 1 | 2 | 3 | 4;
// 0 = choose alcohol
// 1 = choose qty
// 2 = enter name
// 3 = enter phone
// 4 = confirmation

type Choice = "With Alcohol ($23)" | "No Alcohol ($15)";

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(0);
  const [choice, setChoice] = useState<Choice | "">("");
  const [qty, setQty] = useState<string>("1");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  // Generate falling leaves (will switch to coconuts later)
  const leaves = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 6).toFixed(2)}s`,
    duration: `${(8 + Math.random() * 4).toFixed(2)}s`,
  }));

  // Submit final order → Google Sheets
  const submitFinal = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append("choice", choice);
    formData.append("qty", qty);
    formData.append("name", name);
    formData.append("phone", phone);

    try {
      await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        body: formData,
      });
    } catch (e) {
      console.log("Sheets error ignored:", e);
    }

    setSaving(false);
    setStep(4); // confirmation screen
  };

  return (
    <div className="page-container">
      <div className="glow-border" />

      {/* TOP BANNER — DO NOT CHANGE */}
      <header className="banner">
        <img src="/CrackitoFALL.png" alt="Crackito Logo" className="logo" />
      </header>

      {/* FALLING ICONS (leaves first, coconuts on confirmation screen) */}
      <div className="leaves-container" aria-hidden="true">
        {step < 4
          ? leaves.map((leaf) => (
              <div
                key={leaf.id}
                className="leaf"
                style={{
                  left: leaf.left,
                  animationDelay: leaf.delay,
                  animationDuration: leaf.duration,
                }}
              />
            ))
          : leaves.map((leaf) => (
              <div
                key={leaf.id}
                className="coconut"
                style={{
                  left: leaf.left,
                  animationDelay: leaf.delay,
                  animationDuration: leaf.duration,
                }}
              />
            ))}
      </div>

      {/* MAIN CONTENT */}
      <main className="content">
        {/* ORDER FORM TITLE */}
        {step < 4 && <h1 className="order-title">ORDER FORM</h1>}

        {/* ISLAND + BUTTONS STEP 0 */}
        {step === 0 && (
          <>
            <section className="island-container fade-in">
              <img src="/PR_Frame.png" alt="Island" className="island" />
              <div className="button-container">
                <button
                  className="order-btn"
                  onClick={() => {
                    setChoice("With Alcohol ($23)");
                    setStep(1);
                  }}
                >
                  W/ ALCOHOL ($23)
                </button>
                <button
                  className="order-btn"
                  onClick={() => {
                    setChoice("No Alcohol ($15)");
                    setStep(1);
                  }}
                >
                  NO ALCOHOL ($15)
                </button>
              </div>
            </section>
            <p className="limited-text fade-in-slow">VERY LIMITED</p>
          </>
        )}

        {/* STEP 1 — HOW MANY */}
        {step === 1 && (
          <div className="question-card fade-in">
            <p className="question-text">How many bottles?</p>
            <select
              className="dropdown"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            >
              <option value="1">1 Bottle</option>
              <option value="2">2 Bottles</option>
              <option value="3">3 Bottles</option>
            </select>

            <button className="next-btn" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        )}

        {/* STEP 2 — NAME */}
        {step === 2 && (
          <div className="question-card fade-in">
            <p className="question-text">What is your name?</p>
            <input
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
            <button
              className="next-btn"
              onClick={() => name.trim() !== "" && setStep(3)}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 3 — PHONE */}
        {step === 3 && (
          <div className="question-card fade-in">
            <p className="question-text">Phone number?</p>
            <input
              className="text-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="555-555-5555"
            />

            <button
              className="next-btn"
              onClick={() => phone.trim() !== "" && submitFinal()}
              disabled={saving}
            >
              {saving ? "Saving..." : "Submit Order"}
            </button>
          </div>
        )}

        {/* STEP 4 — CONFIRMATION + ISLAND RETURNS + COCONUTS FALL */}
        {step === 4 && (
          <div className="confirmation-screen fade-in">
            <img src="/PR_Frame.png" className="island confirm-island" />

            <p className="confirm-msg">
              Order Confirmed! I will reach out regarding delivery date and
              address. Thank you for supporting Crackito for the 6th year.
              ¡Feliz Día de Acción de Gracias!
            </p>
          </div>
        )}
      </main>

      {/* FOOTER — NEVER CHANGES */}
      <footer className="footer">
        <p>ORDERS TO BE DELIVERED 21st–26TH</p>
        <p className="extra-love">
          If 15+ minutes away, please consider giving a little extra love. Thank
          you!
        </p>
      </footer>
    </div>
  );
};

export default App;
