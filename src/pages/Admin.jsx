export default function Admin(){

const password = prompt('ADMIN PASSWORD')
  
import { ref, remove } from 'firebase/database'
import { db } from '../firebase'
  
if(password !== 'grizzlyadmin'){
return <h1 className="title">ACCESS DENIED</h1>
}

return(

<>

<h1 className="title">
GRIZZLY ADMIN
</h1>

<div className="adminLayout">

<div className="adminCard">

<div className="adminCardTitle">
SYSTEM
</div>

<div className="adminButtons">
<button
className="adminBtn"
onClick={async()=>{
const confirmReset = confirm(
'DELETE ALL CONTRACTS?'
)
if(!confirmReset) return
await remove(ref(db,'contracts'))
alert('Contracts deleted')
}}
>
RESET CONTRACTS
</button>

<button className="adminBtn">
RESET LEADERBOARD
</button>

<button
className="adminBtn"
onClick={async()=>{
const confirmReset = confirm(
'DELETE ENTIRE DATABASE?'
)
if(!confirmReset) return
await remove(ref(db))
alert('Database cleared')
}}
>
CLEAR DATABASE
</button>

<button className="adminBtn">
SERVER RESTART
</button>

</div>

</div>

<div className="adminCard">

<div className="adminCardTitle">
CONTENT
</div>

<div className="adminButtons">

<button
className="adminBtn"
onClick={()=>{

const news = prompt('NEWS TEXT')

if(!news) return

localStorage.setItem(
'grizzly_news',
news
)

alert('News uploaded')

}}
>
UPLOAD NEWS
</button>

<button className="adminBtn">
UPLOAD GALLERY
</button>

<button
className="adminBtn"
onClick={()=>{

const event = prompt('EVENT NAME')

if(!event) return

alert(
`EVENT CREATED: ${event}`
)

}}
>
SEND EVENT
</button>

<button className="adminBtn">
CREATE POST
</button>

</div>

</div>

<div className="adminCard">

<div className="adminCardTitle">
STATISTICS
</div>

<div className="adminStats">

<div className="adminStat">
<h2>247</h2>
<p>MEMBERS</p>
</div>

<div className="adminStat">
<h2>19</h2>
<p>ONLINE</p>
</div>

<div className="adminStat">
<h2>152</h2>
<p>CONTRACTS</p>
</div>

<div className="adminStat">
<h2>$8.4M</h2>
<p>INCOME</p>
</div>

</div>

</div>

</div>

</>

)

}
