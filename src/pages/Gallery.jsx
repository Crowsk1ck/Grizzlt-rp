import { useState } from 'react'
import './gallery.css'

export default function Gallery(){

const [image,setImage] = useState(null)
const [loading,setLoading] = useState(false)
const [uploaded,setUploaded] = useState([])

const uploadImage = async()=>{

if(!image) return

setLoading(true)

const data = new FormData()

data.append('file',image)
data.append('upload_preset','grizzly_upload')
data.append('folder','grizzly')

try{

const res = await fetch(
'https://api.cloudinary.com/v1_1/dgykunfft/image/upload',
{
method:'POST',
body:data
}
)

const file = await res.json()

setUploaded(prev=>[
file.secure_url,
...prev
])

}catch(err){

console.log(err)

}

setLoading(false)

}

return(

<div className="galleryPage">

<h1 className="galleryTitle">
GRIZZLY GALLERY
</h1>

<p className="galleryText">
Скриншоты семьи, контракты и лучшие GTA RP моменты.
</p>

<div className="statsRow">

<div className="statCard">
<h2>{uploaded.length}</h2>
<span>IMAGES</span>
</div>

<div className="statCard">
<h2>LIVE</h2>
<span>CLOUD</span>
</div>

<div className="statCard">
<h2>RP</h2>
<span>MEDIA</span>
</div>

</div>

<div className="uploadPanel">

<input
type="file"
accept="image/*"
onChange={(e)=>setImage(e.target.files[0])}
/>

<button
className="uploadButton"
onClick={uploadImage}
>

{loading ? 'UPLOADING...' : 'UPLOAD IMAGE'}

</button>

</div>

<div className="galleryGrid">

{
uploaded.map((img,index)=>(

<div
key={index}
className="galleryCard"
>

<img
src={img}
alt=""
className="galleryImage"
/>

</div>

))
}

</div>

</div>

)

}
