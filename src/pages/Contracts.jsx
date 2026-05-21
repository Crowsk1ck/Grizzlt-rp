return(
<>

<h1 className="title">
GRIZZLY PANEL
</h1>

<div className="dashboard">

<div className="panel">

<div
className="title"
style={{fontSize:'30px'}}
>
ДОДАТИ КОНТРАКТ
</div>

<input
className="input"
placeholder="📄 Назва контракту"
value={title}
onChange={e=>setTitle(e.target.value)}
/>

<div className="double">

<input
className="input"
placeholder="💰 Сума"
value={amount}
onChange={e=>setAmount(e.target.value)}
/>

<input
className="input"
placeholder="👑 Хто почав контракт"
value={startedBy}
onChange={e=>setStartedBy(e.target.value)}
/>

</div>

<input
className="input"
placeholder="👥 Учасники"
value={members}
onChange={e=>setMembers(e.target.value)}
/>

<div
style={{
display:'flex',
gap:'10px',
marginTop:'15px',
flexWrap:'wrap'
}}
>

<button
className="btn"
style={{
flex:1,
minWidth:'180px'
}}
onClick={sendContract}
>
ДОДАТИ КОНТРАКТ
</button>

<button
className="btn"
style={{
background:'#222',
flex:1,
minWidth:'180px'
}}
onClick={clearPanel}
>
ОЧИСТИТИ ПАНЕЛЬ
</button>

</div>

</div>

<div style={{flex:1}}>

<div className="panel">

<div
className="title"
style={{fontSize:'30px'}}
>
СТАТИСТИКА
</div>

<div className="statGrid">

<div className="stat">
<h2>{contracts.length}</h2>
<p>КОНТРАКТІВ</p>
</div>

<div className="stat">
<h2>${totalIncome.toLocaleString()}</h2>
<p>ЗАГАЛЬНИЙ ДОХІД</p>
</div>

<div className="stat">
<h2>
${Math.floor(totalIncome*0.84).toLocaleString()}
</h2>
<p>ЧИСТИЙ ДОХІД</p>
</div>

<div className="stat">
<h2>
{
contracts.length > 0
? Math.floor(
contracts.reduce((a,b)=>a+b.membersCount,0)
/ contracts.length
)
: 0
}
</h2>

<p>
СЕРЕДНЯ КІЛЬКІСТЬ УЧАСНИКІВ
</p>

</div>

</div>

</div>

</div>

</>

)
