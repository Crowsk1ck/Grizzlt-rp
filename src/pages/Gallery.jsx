import { useState } from 'react'

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

alert('IMAGE UPLOADED')

}catch(err){

console.log(err)

alert('UPLOAD ERROR')

}

setLoading(false)

}

return(

<>

<h1 className="title">
GRIZZLY GALLERY
</h1>

<div className="uploadBox">

<input
type="file"
accept="image/*"
onChange={(e)=>setImage(e.target.files[0])}
/>

<button
className="uploadBtn"
onClick={uploadImage}
>

{loading ? 'UPLOADING...' : 'UPLOAD IMAGE'}

</button>

</div>

<div className="galleryGrid">

{
uploaded.map((img,index)=>(

<img
key={index}
src={img}
className="galleryImage"
alt=""
/>

))
}

</div>

</>

)

}
