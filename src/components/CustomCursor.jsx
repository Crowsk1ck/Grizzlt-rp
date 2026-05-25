import { useEffect, useState } from 'react'

export default function CustomCursor(){

const [clicked,setClicked] = useState(false)

useEffect(()=>{

const cursor = document.querySelector('.custom-cursor')

const move = (e)=>{

if(cursor){

cursor.style.left = e.clientX + 'px'
cursor.style.top = e.clientY + 'px'

}

}

const down = ()=>setClicked(true)
const up = ()=>setClicked(false)

window.addEventListener('mousemove',move)
window.addEventListener('mousedown',down)
window.addEventListener('mouseup',up)

return ()=>{

window.removeEventListener('mousemove',move)
window.removeEventListener('mousedown',down)
window.removeEventListener('mouseup',up)

}

},[])

return(
<div className={`custom-cursor ${clicked ? 'cursor-clicked' : ''}`}></div>
)

}
