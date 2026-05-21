import { useEffect, useState } from 'react'

export default function LoadingScreen({onFinish}){
const [progress,setProgress]=useState(0)
useEffect(()=>{
const i=setInterval(()=>{
setProgress(p=>{
if(p>=100){clearInterval(i);setTimeout(()=>onFinish(),500);return 100}
return p+2
})
},40)
return ()=>clearInterval(i)
},[])
return (
<div className='loadingScreen'>
<div className='loadingLogo'>GRIZZLY FAMILY</div>
<div className='loadingBar'><div className='loadingFill' style={{width:`${progress}%`}}></div></div>
<div className='loadingText'>LOADING {progress}%</div>
</div>
)
}
