export default function Dashboard(){

return(
<>
<h1 className="hero">
GTA 6 RP
</h1>

<p className="subtitle">
Ultimate cinematic GTA RP experience with live Discord integration,
premium gaming UI and Rockstar atmosphere.
</p>

<div className="stats">

<div className="card">
<div>DISCORD ONLINE</div>
<div className="cardValue">147</div>
</div>

<div className="card">
<div>FAMILY BALANCE</div>
<div className="cardValue">$52M</div>
</div>

<div className="card">
<div>ACTIVE WARS</div>
<div className="cardValue">6</div>
</div>

<div className="card">
<div>GLOBAL RANK</div>
<div className="cardValue">TOP 3</div>
</div>

</div>

<div className="bigSection">

<div className="panel">
<h2 style={{fontSize:'42px',marginBottom:'25px',color:'#ff004c'}}>
LIVE CONTRACTS
</h2>

<div className="item">🔥 Territory Assault</div>
<div className="item">💰 Bank Delivery</div>
<div className="item">⚔ Gang Elimination</div>
<div className="item">🚚 VIP Escort</div>
</div>

<div className="panel">
<h2 style={{fontSize:'42px',marginBottom:'25px',color:'#ff004c'}}>
FAMILY ACTIVITY
</h2>

<div className="item">👥 New member joined</div>
<div className="item">🏆 Contract completed</div>
<div className="item">⚡ Territory captured</div>
<div className="item">💀 War started</div>
</div>

</div>
</>
)
}