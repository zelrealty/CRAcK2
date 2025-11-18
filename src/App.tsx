import React, { useState } from "react";
import "./App.css";

const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxFUg0-Ck7_M4HIMAT5d7tyXpA4qoBMDM_6ouSeA6hloPZp4fJlXay-LSRSmjmO4coH/exec";

const App: React.FC = () => {
  // === ORDER STATE MACHINE ===
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [choice, setChoice] = useState<"" | "With Alcohol ($23)" | "No Alcohol ($15)">("");
  const [quantity, setQuantity] = useState<string>("1");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // === ANIMATION STATE ===
  const [islandFading, setIslandFading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // === LEAVES / COCONUTS ===
  const generateItems = (type: "leaf" | "coconut") => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 4).toFixed(2)}s`,
      duration: `${(8 + Math.random() * 5).toFixed(2)}s`,
      type,
    }));
  };

  const falling = confirmed ? generateItems("coconut") : generateItems("leaf");

  // === SEND TO GOOGLE SHEETS ===
  const submitToSheets = async () => {
    const formData = new FormData();
    formData.append("choice", choice);
    formData.append("quantity", quantity);
    formData.append("name", name);
    formData.append("phone", phone);

    try {
      await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
    } catch (err) {
      console.error("Sheets error (ignored):", err);
    }
  };

  // === STEP ADVANCE HANDLING ===
  const startQuestions = (val: "With Alcohol ($23)" | "No Alcohol ($15)") => {
    setChoice(val);
    setIslandFading(true);

    setTimeout(() => {
      setStep(1); // show first question
    }, 900);
  };

  const finishOrder = async () => {
    await submitToSheets();
    setConfirmed(true);
    setStep(4);
  };

  return (
    <div className="page-container">
      <div className="glow-border" />

      {/* TOP BANNER */}
      <header className="banner">
        <img src="/CrackitoFALL.png" alt="Crackito Logo" className="logo" />
      </header>

      {/* FALLING LEAVES / COCONUTS */}
      <div className="leaves-container" aria-hidden="true">
        {falling.map((item) => (
          <div
            key={item.id}
            className={confirmed ? "coconut" : "leaf"}
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main className="content">
        {/* ORDER TITLE (visible only before confirmation) */}
        {step === 0 && (
          <>
            <h1 className="order-title">ORDER FORM</h1>

            <section className="island-container">
              <img
                src="/PR_Frame.png"
                alt="Puerto Rico Outline"
                className="island"
                style={{
                  animation: islandFading ? "islandFadeOut 1s forwards" : undefined,
                }}
              />

              <div className="button-container">
                <button
                  className="order-btn"
                  onClick={() => startQuestions("With Alcohol ($23)")}
                >
                  W/ ALCOHOL ($23)
                </button>

                <button
                  className="order-btn"
                  onClick={() => startQuestions("No Alcohol ($15)")}
                >
                  NO ALCOHOL ($15)
                </button>
              </div>
            </section>

            <p
              className="limited-text"
              style={{
                animation: islandFading ? "dissolve .9s forwards" : undefined,
              }}
            >
              VERY LIMITED
            </p>
          </>
        )}

        {/* ====== QUESTION 1 ====== */}
        {step === 1 && (
          <div className="question-card fade-in">
            <p className="question-text">How many bottles would you like?</p>
            <select
              className="dropdown"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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

        {/* ====== QUESTION 2 ====== */}
        {step === 2 && (
          <div className="question-card fade-in">
            <p className="question-text">Your name?</p>
            <input
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
            <button className="next-btn" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        )}

        {/* ====== QUESTION 3 ====== */}
        {step === 3 && (
          <div className="question-card fade-in">
            <p className="question-text">Phone number?</p>
            <input
              className="text-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(xxx) xxx-xxxx"
            />
            <button className="next-btn" onClick={finishOrder}>
              Submit
            </button>
          </div>
        )}

        {/* ====== CONFIRMATION ====== */}
        {step === 4 && (
          <div className="confirmation-screen fade-in-slow">
            <img
              src="/PR_Frame.png"
              alt="Puerto Rico Outline"
              className="confirm-island"
            />

            <p className="confirm-msg" style={{ marginTop: "14px" }}>
              <strong>Order Confirmed!</strong> I will reach out regarding delivery
              date and address. Thank you for supporting Crackito for the 6th year.
              ¡Feliz Día de Acción de Gracias!
            </p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>ORDERS TO BE DELIVERED 21st–26TH</p>
        <p className="extra-love">
          If 15+ minutes away, please consider giving a little extra love. Thank you!
        </p>
      </footer>
    </div>
  );
};

export default App;
