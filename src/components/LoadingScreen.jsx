import { useEffect, useState } from 'react'

export default function LoadingScreen({ onFinish }) {

const [progress, setProgress] = useState(0)

useEffect(() => {

const interval = setInterval(() => {

setProgress(prev => {

if(prev >= 100){

clearInterval(interval)

setTimeout(() => {
onFinish()
},500)

return 100
}

return prev + 1

})

},30)

return () => clearInterval(interval)

},[])

return (

<div className="loadingScreen">

<div className="loadingCenter">

<h1 className="loadingLogo">
GRIZZLY FAMILY
</h1>

<div className="loadingBar">

<div
className="loadingFill"
style={{
width:`${progress}%`
}}
></div>

</div>

<div className="loadingPercent">
LOADING {progress}%
</div>

</div>

</div>

)

}