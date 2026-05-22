export default function Admin(){

const password = prompt('ADMIN PASSWORD')

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

<button className="adminBtn">
RESET CONTRACTS
</button>

<button className="adminBtn">
RESET LEADERBOARD
</button>

<button className="adminBtn">
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

<button className="adminBtn">
UPLOAD NEWS
</button>

<button className="adminBtn">
UPLOAD GALLERY
</button>

<button className="adminBtn">
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
