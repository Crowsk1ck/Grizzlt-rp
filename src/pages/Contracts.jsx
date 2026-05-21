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

<div
className="panel"
style={{
marginTop:'25px',
width:'100%'
}}
>

<div
className="title"
style={{fontSize:'30px'}}
>
ЛІДЕРИ МІСЯЦЯ
</div>

<div
style={{
display:'grid',
gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
gap:'15px',
marginTop:'20px'
}}
>

{
Object.entries(

contracts.reduce((acc,c)=>{

if(!acc[c.startedBy]){
acc[c.startedBy]=0
}

acc[c.startedBy]+=1

return acc

},{})

)
.sort((a,b)=>b[1]-a[1])
.slice(0,10)
.map(([name,count],index)=>(

<div
key={index}
className="stat"
style={{
padding:'20px',
textAlign:'center'
}}
>

<h2 style={{
marginBottom:'15px'
}}>
#{index+1}
</h2>

<div style={{
color:'#ff0055',
fontWeight:'700',
fontSize:'22px',
marginBottom:'10px'
}}>
{name}
</div>

<div style={{
color:'#00ff99',
fontSize:'20px',
fontWeight:'700'
}}>
{count} контрактів
</div>

</div>

))
}

</div>

<button
className="btn"
style={{
marginTop:'20px',
width:'100%'
}}
onClick={()=>{

const password = prompt('Введіть пароль')

if(password !== 'grizzlytop'){
alert('Невірний пароль')
return
}

const text =
Object.entries(

contracts.reduce((acc,c)=>{

if(!acc[c.startedBy]){
acc[c.startedBy]=0
}

acc[c.startedBy]+=1

return acc

},{})

)
.sort((a,b)=>b[1]-a[1])
.map(([name,count],index)=>
`${index+1}. ${name} — ${count} контрактів`
)
.join('\n')

const blob = new Blob([text],{
type:'text/plain'
})

const a = document.createElement('a')

a.href = URL.createObjectURL(blob)

a.download = 'leaders.txt'

a.click()

}}
>
СКАЧАТИ ЛІДЕРІВ
</button>

</div>

</div>

</div>

</>

)
