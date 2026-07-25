import { appChrome, seedChannel } from "../lib/seed";

function IconBadge({ label, tone }) {
  return <span className={`icon-badge icon-${tone}`}>{label}</span>;
}

function Section({ title, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-titlebar">
        <h2>{title}</h2>
        {action ? <button className="ghost-btn">{action}</button> : null}
      </div>
      {children}
    </section>
  );
}

function AgentCard({ agent }) {
  return (
    <article className={`agent-card agent-${agent.tone}`}>
      <div className="agent-icon">{agent.short}</div>
      <div className="agent-copy">
        <strong>{agent.name}</strong>
        <span>{agent.role}</span>
      </div>
    </article>
  );
}

function DebateCard({ item }) {
  return (
    <article className={`debate-card debate-${item.tone}`}>
      <div className="debate-head">
        <div className="debate-persona">
          <div className="debate-avatar">{item.avatar}</div>
          <div>
            <div className="debate-title">
              <strong>{item.title}</strong>
              <span className="ai-pill">AI</span>
            </div>
            <p>{item.subtitle}</p>
          </div>
        </div>
        <div className="debate-meta">
          <span>{item.time}</span>
          <button className="ghost-icon">⋮</button>
        </div>
      </div>
      <div className="debate-body">
        {item.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="debate-actions">
        <button className="ghost-btn">👍 {item.likes}</button>
        <button className="ghost-btn">👎</button>
      </div>
    </article>
  );
}

function SettingRow({ label, value }) {
  return (
    <div className="setting-row">
      <div className="setting-label">
        <span className="setting-dot" />
        <strong>{label}</strong>
      </div>
      <div className="setting-value">
        <span>{value}</span>
        <span className="chev">›</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="app-shell">
      <aside className="left-rail">
        <div className="brand-bar">
          <div className="brand-mark">
            <span className="brand-m">M</span>
          </div>
          <div>
            <strong>Mizan</strong>
            <span>Decision Room</span>
          </div>
        </div>

        <div className="rail-section">
          <div className="rail-kicker">Workspace</div>
          <div className="workspace-row">
            <div className="workspace-icon">◫</div>
            <div>
              <strong>Mizan Workspace</strong>
            </div>
            <span className="chev">⌄</span>
          </div>
        </div>

        <div className="rail-section">
          <div className="rail-kicker with-plus">
            <span>Channels</span>
            <button className="ghost-icon">+</button>
          </div>
          <div className="channel-list">
            {appChrome.channels.map((channel) => (
              <div key={channel} className={`channel-item ${channel === seedChannel.slug ? "active" : ""}`}>
                <span className="hash">#</span>
                <span>{channel}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rail-section">
          <div className="rail-kicker">Active Agents</div>
          <div className="agent-list">
            {appChrome.agents.map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        </div>

        <div className="status-card">
          <span className="status-dot" />
          <div>
            <strong>System Online</strong>
            <p>All agents operational</p>
          </div>
          <svg viewBox="0 0 80 20" aria-hidden="true">
            <path d="M0 14h8l4-8 4 10 5-14 7 12 5-4 4 6 5-10 6 8 4-6 4 2 5-4 4 8 6-2" />
          </svg>
        </div>

        <div className="profile-card">
          <div className="avatar-circle">ZK</div>
          <div>
            <strong>Zuhaib Khan</strong>
            <p>Pro Plan</p>
          </div>
          <span className="chev">›</span>
        </div>
      </aside>

      <section className="main-stage">
        <header className="top-nav">
          <div className="channel-switcher">
            <strong>#{seedChannel.slug}</strong>
            <span className="chev">⌄</span>
          </div>

          <nav className="tab-nav" aria-label="Primary">
            {["Debate", "Evidence", "Analytics", "History"].map((item, index) => (
              <a key={item} className={index === 0 ? "tab active" : "tab"} href="#">
                {item}
                {item === "Evidence" ? <span className="tab-pill">12</span> : null}
              </a>
            ))}
          </nav>

          <div className="top-actions">
            <label className="search-box">
              <span>⌕</span>
              <input type="text" defaultValue="" placeholder="Search..." aria-label="Search" />
              <kbd>⌘K</kbd>
            </label>
            <button className="ghost-icon">🔔</button>
            <button className="ghost-icon">?</button>
            <div className="avatar-pill">ZK</div>
          </div>
        </header>

        <div className="content-grid">
          <div className="center-column">
            <div className="topic-card">
              <div className="topic-hash">#</div>
              <div className="topic-copy">
                <h1>{seedChannel.topic}</h1>
                <div className="topic-meta">
                  <IconBadge label="● Live" tone="live" />
                  <span>Round 2 of 3</span>
                  <span>⏱ {seedChannel.elapsed}</span>
                  <span>4 Agents</span>
                  <span className="tiny-icons">
                    <span>⚖</span>
                    <span>🛡</span>
                    <span>⚡</span>
                    <span>◌</span>
                  </span>
                </div>
              </div>
              <div className="topic-actions">
                <button className="ghost-icon">☆</button>
                <button className="ghost-icon">↗</button>
                <button className="ghost-icon">⋮</button>
              </div>
            </div>

            <div className="debate-stack">
              {seedChannel.debate.map((item) => (
                <DebateCard key={item.title} item={item} />
              ))}
            </div>

            <div className="composer-card">
              <div className="composer-input">
                Enter a topic, job offer, or decision prompt...
              </div>
              <div className="composer-row">
                <button className="ghost-btn plus-btn">＋</button>
                <button className="ghost-btn">Templates ▾</button>
                <div className="composer-tools">
                  <button className="ghost-btn">🎙 Voice ▾</button>
                  <button className="ghost-btn">🌐 English ▾</button>
                  <button className="start-btn">▶ Start Debate</button>
                </div>
              </div>
              <div className="footer-actions">
                <button className="footer-btn">⏸ Pause</button>
                <button className="footer-btn danger">■ Stop Debate</button>
                <button className="footer-btn">⇩ Export ▾</button>
              </div>
            </div>
          </div>

          <aside className="right-column">
            <Section title="Debate Settings" action="⚙">
              <div className="settings-list">
                {appChrome.settings.map((setting) => (
                  <SettingRow key={setting.label} {...setting} />
                ))}
              </div>
              <button className="settings-btn">✎ Edit Settings</button>
            </Section>

            <Section title="Decision Summary">
              <div className="summary-card">
                <div className="summary-head">
                  <div className="summary-label">
                    <IconBadge label="⚖" tone="summary" />
                    <strong>Current Lean</strong>
                  </div>
                  <span className="lean-pill">Lean Yes</span>
                </div>
                <p>{seedChannel.summary}</p>
                <div className="confidence-row">
                  <strong>Confidence</strong>
                  <span>72%</span>
                </div>
                <div className="confidence-bar">
                  <span />
                </div>
              </div>

              <div className="summary-group">
                <h3>Key Risks</h3>
                <ul>
                  {seedChannel.risks.map((risk) => (
                    <li key={risk}>
                      <span className="warn-triangle">⚠</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="summary-group">
                <h3>What's Missing</h3>
                <ul>
                  {seedChannel.missingInformation.map((item) => (
                    <li key={item}>
                      <span className="info-circle">?</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="next-step-card">
                <div className="next-step-title">
                  <span>→</span>
                  <strong>Next Step</strong>
                </div>
                <p>{seedChannel.nextAction}</p>
              </div>

              <button className="analysis-btn">View Full Analysis ›</button>
            </Section>
          </aside>
        </div>
      </section>
    </main>
  );
}
