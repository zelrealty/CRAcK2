import React, { useState } from "react";
import "./App.css";

// Google Sheets endpoint
const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyB548qtWGscUlP-mS3OQSC1ZS3jtteLTUEK4HBAK7oBgQ3Mnli76Yb_T0LuOpgmFZ4/exec";

type Choice = "With Alcohol ($23)" | "No Alcohol ($15)";
type LeafKind = "red" | "orange" | "yellow";

interface Leaf {
  id: number;
  kind: LeafKind;
  left: string;
  delay: string;
  duration: string;
}

const App: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<Choice | "">("");

  // generate leaves (simple + TS-safe)
  const leaves: Leaf[] = [];
  for (let i = 0; i < 14; i++) {
    const idx = i % 3;
    const kind: LeafKind = idx === 0 ? "red" : idx === 1 ? "orange" : "yellow";
    leaves.push({
      id: i,
      kind,
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 6).toFixed(2)}s`,
      duration: `${(8 + Math.random() * 4).toFixed(2)}s`,
    });
  }

  const handleSubmit = (choice: Choice) => {
    setSelectedOption(choice);
    const formData = new FormData();
    formData.append("choice", choice);

    // Fire-and-forget request to Google Apps Script
    fetch(SHEETS_ENDPOINT, {
      method: "POST",
      body: formData,
    }).catch(() => {
      // ignore network errors on client side
    });
  };

  return (
    <div className="page-container">
      {/* Outside glow around the entire page */}
      <div className="glow-border" />

      {/* BLACK BANNER touching top + sides */}
      <header className="banner">
        <img
          src="/CrackitoFALL.png"
          alt="Crackito Logo"
          className="logo"
        />
      </header>

      {/* Falling leaves BELOW the banner only */}
      <div className="leaves-container" aria-hidden="true">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className={
              "leaf " +
              (leaf.kind === "red"
                ? "leaf--red"
                : leaf.kind === "orange"
                ? "leaf--orange"
                : "leaf--yellow")
            }
            style={{
              left: leaf.left,
              animationDelay: leaf.delay,
              animationDuration: leaf.duration,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <main className="content">
        <h1 className="order-title">ORDER FORM</h1>

        <section className="island-container">
          <img
            src="/PR_Frame.png"
            alt="Puerto Rico Outline"
            className="island"
          />
          <div className="button-container">
            <button
              className="order-btn"
              onClick={() => handleSubmit("With Alcohol ($23)")}
            >
              W/ ALCOHOL ($23)
            </button>
            <button
              className="order-btn"
              onClick={() => handleSubmit("No Alcohol ($15)")}
            >
              NO ALCOHOL ($15)
            </button>
          </div>
        </section>

        <p className="limited-text">VERY LIMITED</p>
        {selectedOption && (
          <p className="confirmation">
            Saved choice: <span>{selectedOption}</span>
          </p>
        )}
      </main>

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
