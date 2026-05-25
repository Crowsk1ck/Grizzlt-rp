import { useEffect, useRef } from 'react'

export default function CustomCursor(){

const ref = useRef(null)

useEffect(()=>{

const move = (e)=>{

if(ref.current){
ref.current.style.left = e.clientX + 'px'
ref.current.style.top = e.clientY + 'px'
}

}

window.addEventListener('mousemove',move)

return ()=>window.removeEventListener('mousemove',move)

},[])

return <div ref={ref} className="custom-cursor"></div>

}
