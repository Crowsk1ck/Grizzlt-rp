export default function Admin(){
const password=prompt('ADMIN PASSWORD')
if(password!=='grizzlyadmin') return <h1 className='title'>ACCESS DENIED</h1>
return (
<div className='panel'>
<h1 className='title'>ADMIN PANEL</h1>
<div className='adminGrid'>
<button className='btn'>RESET CONTRACTS</button>
<button className='btn'>RESET LEADERBOARD</button>
<button className='btn'>UPLOAD NEWS</button>
<button className='btn'>UPLOAD GALLERY</button>
</div>
</div>
)
}
