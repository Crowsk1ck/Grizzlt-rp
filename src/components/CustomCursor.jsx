
import { useEffect, useRef } from 'react'

export default function CustomCursor(){

const cursorRef = useRef(null)

useEffect(()=>{

const move = (e)=>{

if(cursorRef.current){
cursorRef.current.style.left = e.clientX + 'px'
cursorRef.current.style.top = e.clientY + 'px'
}

}

window.addEventListener('mousemove',move)

return ()=>window.removeEventListener('mousemove',move)

},[])

return <div ref={cursorRef} className="custom-cursor"></div>

}
