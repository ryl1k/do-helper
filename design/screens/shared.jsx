// Shared helpers across all three directions.

const StatusBar = ({ time = '9:41', dark = true }) => (
  <div style={{
    height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 22px', fontSize: 13, fontWeight: 600,
    color: dark ? '#fff' : '#000',
    fontFamily: 'ui-sans-serif, system-ui',
  }}>
    <span>{time}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11"><g fill={dark ? '#fff' : '#000'}>
        <rect x="0" y="7" width="3" height="4" rx="1"/>
        <rect x="5" y="5" width="3" height="6" rx="1"/>
        <rect x="10" y="2" width="3" height="9" rx="1"/>
        <rect x="15" y="0" width="3" height="11" rx="1" opacity=".4"/>
      </g></svg>
      {/* battery */}
      <svg width="25" height="11" viewBox="0 0 25 11">
        <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" fill="none" stroke={dark ? '#fff' : '#000'} opacity=".5"/>
        <rect x="2" y="2" width="14" height="7" rx="1" fill={dark ? '#fff' : '#000'}/>
        <rect x="22.5" y="3.5" width="1.5" height="4" rx=".5" fill={dark ? '#fff' : '#000'} opacity=".5"/>
      </svg>
    </div>
  </div>
);

const HomeIndicator = ({ color = '#fff' }) => (
  <div style={{ height: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8 }}>
    <div style={{ width: 130, height: 4, borderRadius: 999, background: color, opacity: 0.85 }} />
  </div>
);

const Kbd = ({ children, style }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 16, height: 16, padding: '0 4px', borderRadius: 3,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 10, fontWeight: 500,
    background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.08)',
    ...style,
  }}>{children}</span>
);

window.StatusBar = StatusBar;
window.HomeIndicator = HomeIndicator;
window.Kbd = Kbd;
