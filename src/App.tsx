import React, { useMemo, useState } from "react";
import "./App.css";

const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyiGBibqoe3WlQdphInfg1pEDIoBuJk_AIpjWD1bT6FJeuIXrTdzvEq6ESFqCAjaBQQ/exec";

type Choice = "With Alcohol ($23)" | "No Alcohol ($15)";

interface FallingThing {
  id: number;
  left: string;
  delay: string;
  duration: string;
}

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0); // 0 = island, 1 = qty, 2 = phone, 3 = name, 4 = done
  const [choice, setChoice] = useState<Choice | "">("");
  const [quantity, setQuantity] = useState<string>("1");
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Falling leaves before submit
  const leaves: FallingThing[] = useMemo(() => {
    const arr: FallingThing[] = [];
    for (let i = 0; i < 14; i += 1) {
      arr.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${(Math.random() * 6).toFixed(2)}s`,
        duration: `${(8 + Math.random() * 4).toFixed(2)}s`,
      });
    }
    return arr;
  }, []);

  // Falling coconuts after submit
  const coconuts: FallingThing[] = useMemo(() => {
    const arr: FallingThing[] = [];
    for (let i = 0; i < 14; i += 1) {
      arr.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${(Math.random() * 6).toFixed(2)}s`,
        duration: `${(8 + Math.random() * 4).toFixed(2)}s`,
      });
    }
    return arr;
  }, []);

  const handleChoice = (value: Choice) => {
    setChoice(value);
    setStep(1); // go to "how many bottles"
  };

  const handleNextQuantity = () => {
    if (!quantity) return;
    setStep(2);
  };

  const handleNextPhone = () => {
    if (!phone.trim()) return;
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!choice || !quantity || !phone.trim() || !name.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("choice", choice);
      formData.append("quantity", quantity);
      formData.append("phone", phone.trim());
      formData.append("name", name.trim());

      // Fire-and-forget to Google Apps Script
      await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        body: formData,
        mode: "no-cors" as RequestMode,
      });

      setSubmitted(true);
      setStep(4);
    } catch {
      // we’re ignoring errors on the UI side, just like before
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Glow border */}
      <div className="glow-border" />

      {/* Black top banner with Crackito logo */}
      <header className="banner">
        <img src="/CrackitoFALL.png" alt="Crackito Logo" className="logo" />
      </header>

      {/* Falling leaves (before submit) / coconuts (after submit) */}
      <div className="leaves-container" aria-hidden="true">
        {(submitted ? coconuts : leaves).map((item: FallingThing) => (
          <div
            key={item.id}
            className={submitted ? "coconut" : "leaf"}
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          />
        ))}
      </div>

      <main className="content">
        <h1 className="order-title">ORDER FORM</h1>

        {/* BEFORE SUBMIT */}
        {!submitted && (
          <>
            {/* Step 0: island + two buttons + VERY LIMITED */}
            {step === 0 && (
              <>
                <section className="island-container">
                  <img
                    src="/PR_Frame.png"
                    alt="Puerto Rico Outline"
                    className="island"
                  />
                  <div className="button-container">
                    <button
                      className="order-btn"
                      onClick={() => handleChoice("With Alcohol ($23)")}
                    >
                      W/ ALCOHOL ($23)
                    </button>
                    <button
                      className="order-btn"
                      onClick={() => handleChoice("No Alcohol ($15)")}
                    >
                      NO ALCOHOL ($15)
                    </button>
                  </div>
                </section>
                <p className="limited-text">VERY LIMITED</p>
              </>
            )}

            {/* Step 1: How many bottles? */}
            {step === 1 && (
              <div className="question-card fade-in">
                <p className="question-text">How many bottles?</p>
                <select
                  className="dropdown"
                  value={quantity}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setQuantity(e.target.value)
                  }
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                <br />
                <button className="next-btn" onClick={handleNextQuantity}>
                  Next
                </button>
              </div>
            )}

            {/* Step 2: Phone number */}
            {step === 2 && (
              <div className="question-card fade-in">
                <p className="question-text">What&apos;s your phone number?</p>
                <input
                  className="text-input"
                  type="tel"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhone(e.target.value)
                  }
                  placeholder="(___) ___-____"
                />
                <br />
                <button
                  className="next-btn"
                  onClick={handleNextPhone}
                  disabled={!phone.trim()}
                >
                  Next
                </button>
              </div>
            )}

            {/* Step 3: Name + Submit */}
            {step === 3 && (
              <div className="question-card fade-in">
                <p className="question-text">What&apos;s your name?</p>
                <input
                  className="text-input"
                  type="text"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  placeholder="Full name"
                />
                <br />
                <button
                  className="next-btn"
                  onClick={handleSubmit}
                  disabled={!name.trim() || submitting}
                >
                  {submitting ? "Saving..." : "Submit"}
                </button>
              </div>
            )}
          </>
        )}

        {/* AFTER SUBMIT */}
        {submitted && (
          <div className="confirmation-screen fade-in-slow">
            <img
              src="/PR_Frame.png"
              alt="Puerto Rico Outline"
              className="confirm-island"
            />
            <p className="confirm-msg">
              Order Confirmed! I will reach out regarding delivery date and
              address. Thank you for supporting Crackito for the 6th year. ¡Feliz
              Día de Acción de Gracias!
            </p>
          </div>
        )}
      </main>

      {/* Footer stays stuck to bottom */}
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
