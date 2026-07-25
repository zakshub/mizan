import { seedChannel, workspaceStats } from "../lib/seed";

function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Panel({ title, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-header">
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}

function Message({ role, title, meta, children, tone }) {
  return (
    <article className="message">
      <div className="message-top">
        <div>
          <h3>{title}</h3>
          <p>{meta}</p>
        </div>
        <Badge tone={tone}>{role}</Badge>
      </div>
      <div className="message-body">{children}</div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="shell">
      <aside className="rail left-rail">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>Mizan</strong>
            <span>Decision Room</span>
          </div>
        </div>

        <Panel title="Workspaces">
          <div className="stack">
            <div className="sidebar-item active">Career and Hiring</div>
            <div className="sidebar-item">General Reasoning</div>
            <div className="sidebar-item">Business</div>
            <div className="sidebar-item">Finance</div>
          </div>
        </Panel>

        <Panel title="Channels">
          <div className="stack">
            <div className="sidebar-item active">#job-negotiation</div>
            <div className="sidebar-item">#career-decisions</div>
            <div className="sidebar-item">#offer-review</div>
          </div>
        </Panel>

        <Panel title="Active Agents">
          <div className="stack compact">
            <div className="agent-chip positive">Thesis</div>
            <div className="agent-chip caution">Antithesis</div>
            <div className="agent-chip verify">Evidence</div>
            <div className="agent-chip judge">Judge</div>
          </div>
        </Panel>
      </aside>

      <section className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Seeded debate</p>
            <h1>{seedChannel.topic}</h1>
          </div>
          <div className="topbar-actions">
            <button>Pause</button>
            <button>Stop</button>
            <button className="primary">Export</button>
          </div>
        </header>

        <div className="content-grid">
          <div className="feed">
            <Panel title="Live Debate">
              <div className="stack message-stack">
                {seedChannel.messages.map((message) => (
                  <Message
                    key={message.id}
                    role={message.role}
                    title={message.title}
                    meta={message.meta}
                    tone={message.tone}
                  >
                    {message.body.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </Message>
                ))}
              </div>
            </Panel>
          </div>

          <div className="summary-rail">
            <Panel title="Decision Summary">
              <div className="summary-card">
                <Badge tone="judge">{seedChannel.verdict}</Badge>
                <strong>{seedChannel.headline}</strong>
                <p>{seedChannel.reason}</p>
              </div>
              <div className="metric-grid">
                {workspaceStats.map((item) => (
                  <div key={item.label} className="metric">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Missing Information">
              <ul className="list">
                {seedChannel.missingInformation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Panel>

            <Panel title="Next Action">
              <p>{seedChannel.nextAction}</p>
              <div className="callout">
                <strong>Do not disclose:</strong>
                <p>{seedChannel.doNotDisclose}</p>
              </div>
            </Panel>
          </div>
        </div>
      </section>
    </main>
  );
}
