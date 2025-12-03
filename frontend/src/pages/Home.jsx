import { useMemo, useState } from 'react';
import './Home.css';

const spendBands = [
  '< $1k / month',
  '$1k – $5k / month',
  '$5k – $25k / month',
  '$25k – $100k / month',
  '$100k+ / month',
];

const useMockTracker = () =>
  useMemo(
    () => ({
      monthlyTotal: 18432,
      billsSubmitted: 57,
      avgSavingsPercent: 22,
      lastUpdated: '2025-11-06T14:15:00Z',
      runwayGoal: 100,
    }),
    []
  );

const Home = () => {
  const [formValues, setFormValues] = useState({
    provider: '',
    spendBand: '',
    email: '',
    notes: '',
    consent: false,
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const tracker = useMockTracker();

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setFormValues({
      provider: '',
      spendBand: '',
      email: '',
      notes: '',
      consent: false,
    });
    setHasSubmitted(false);
  };

  const handleScrollToForm = () => {
    const formSection = document.getElementById('bill-intake');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const lastUpdated = new Date(tracker.lastUpdated).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-preheader">Help build the cloud cost benchmark</div>
          <h1 className="hero-title">
            Share your <span className="accent">cloud bill</span>, unlock smarter savings.
          </h1>
          <p className="hero-copy">
            We are collecting real cloud spend data to surface pricing patterns, vendor traps, and
            quick wins for engineering teams. Add your bill anonymously and follow our journey in
            public.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={handleScrollToForm}>
              Share your bill
            </button>
            <button className="btn btn-outline btn-large" onClick={handleScrollToForm}>
              See how the tracker works
            </button>
          </div>
          <dl className="hero-proof">
            <div className="proof-item">
              <dt>{tracker.billsSubmitted}</dt>
              <dd>Bills already contributed</dd>
            </div>
            <div className="proof-item">
              <dt>{tracker.avgSavingsPercent}%</dt>
              <dd>Average savings on first pass</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="intake-section" id="bill-intake">
        <div className="intake-container">
          <div className="intake-card">
            <header className="intake-header">
              <h2>Kick off the benchmark</h2>
              <p>Drop in a few details so we can group costs by provider and spend range.</p>
            </header>

            {hasSubmitted ? (
              <div className="thank-you">
                <h3>Thanks for adding your bill!</h3>
                <p>
                  We will follow up over email once the first insights are live. Want to add another
                  bill?
                </p>
                <button className="btn btn-primary" onClick={handleReset}>
                  Submit another bill
                </button>
              </div>
            ) : (
              <form className="intake-form" onSubmit={handleSubmit}>
                <div className="field-group">
                  <label htmlFor="provider">Cloud provider</label>
                  <input
                    id="provider"
                    name="provider"
                    type="text"
                    placeholder="e.g. AWS, GCP, Azure"
                    value={formValues.provider}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="spendBand">Monthly spend band</label>
                  <select
                    id="spendBand"
                    name="spendBand"
                    value={formValues.spendBand}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a range</option>
                    {spendBands.map((band) => (
                      <option key={band} value={band}>
                        {band}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formValues.email}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="field-hint">
                    Only used to send you the final benchmark and anonymize future updates.
                  </span>
                </div>

                <div className="field-group">
                  <label htmlFor="notes">Anything else we should know?</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Share billing quirks, discount details, or questions."
                    value={formValues.notes}
                    onChange={handleInputChange}
                  />
                </div>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formValues.consent}
                    onChange={handleInputChange}
                    required
                  />
                  I agree to share anonymized billing data for research purposes.
                </label>

                <button type="submit" className="btn btn-primary btn-submit">
                  Add my bill to the sprintboard
                </button>
              </form>
            )}
          </div>

          <aside className="tracker-card">
            <header className="tracker-header">
              <h3>Live Cloud Spend Tracker</h3>
              <p>Follow our own optimization work in real time.</p>
            </header>

            <div className="tracker-metric emphasis">
              <span className="metric-label">Current monthly invoice</span>
              <span className="metric-value">${tracker.monthlyTotal.toLocaleString()}</span>
              <span className="metric-subtext">Last updated {lastUpdated}</span>
            </div>

            <div className="tracker-grid">
              <div className="tracker-metric">
                <span className="metric-label">Bills collected</span>
                <span className="metric-value">{tracker.billsSubmitted}</span>
              </div>
              <div className="tracker-metric">
                <span className="metric-label">Average savings</span>
                <span className="metric-value">{tracker.avgSavingsPercent}%</span>
              </div>
              <div className="tracker-metric">
                <span className="metric-label">Sprintboard goal</span>
                <span className="metric-value">
                  {tracker.billsSubmitted}/{tracker.runwayGoal}
                </span>
              </div>
            </div>

            <div className="tracker-footnote">
              <h4>What happens next?</h4>
              <ul>
                <li>We cluster submissions by provider, spend band, and growth stage.</li>
                <li>We publish anonymized benchmarks and pricing red flags.</li>
                <li>You get first access to optimization recipes and tooling.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Home;
