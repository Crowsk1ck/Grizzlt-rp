
import { useState } from 'react'
import './gallery.css'

export default function Gallery(){

const [image,setImage] = useState(null)
const [loading,setLoading] = useState(false)
const [uploaded,setUploaded] = useState([])
const [activeCategory,setActiveCategory] = useState('ALL')
const [selected,setSelected] = useState(null)

const categories = [
'ALL',
'WAR',
'CONTRACTS',
'EVENTS',
'FAMILY'
]

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

const newImage = {
url:file.secure_url,
category:'FAMILY',
created:Date.now()
}

setUploaded(prev=>[
newImage,
...prev
])

}catch(err){

console.log(err)
alert('UPLOAD ERROR')

}

setLoading(false)

}

const filtered =
activeCategory === 'ALL'
? uploaded
: uploaded.filter(x=>x.category===activeCategory)

return(

<div className="galleryPage">

<div className="galleryHeader">

<div>

<h1 className="galleryTitle">
GRIZZLY GALLERY
</h1>

<p className="galleryText">
PREMIUM GTA RP MEDIA HUB
</p>

</div>

<div className="galleryStats">

<div className="statCard">
<h2>{uploaded.length}</h2>
<span>UPLOADS</span>
</div>

<div className="statCard">
<h2>LIVE</h2>
<span>CLOUDINARY</span>
</div>

</div>

</div>

<div className="uploadZone">

<label className="uploadLabel">

<input
type="file"
accept="image/*"
onChange={(e)=>setImage(e.target.files[0])}
hidden
/>

<div className="uploadInner">

<div className="uploadIcon">
+
</div>

<h2>
DRAG & DROP MEDIA
</h2>

<p>
UPLOAD GTA SCREENSHOTS
</p>

</div>

</label>

<button
className="uploadButton"
onClick={uploadImage}
>

{loading ? 'UPLOADING...' : 'UPLOAD IMAGE'}

</button>

</div>

<div className="categoryRow">

{
categories.map(cat=>(

<button
key={cat}
className={
activeCategory === cat
? 'categoryBtn active'
: 'categoryBtn'
}
onClick={()=>setActiveCategory(cat)}
>

{cat}

</button>

))
}

</div>

<div className="masonryGrid">

{
filtered.map((img,index)=>(

<div
key={index}
className="galleryCard"
onClick={()=>setSelected(img.url)}
>

<img
src={img.url}
className="galleryImage"
alt=""
/>

<div className="overlay">

<span className="badge">
{img.category}
</span>

</div>

</div>

))
}

</div>

{
selected && (

<div
className="modal"
onClick={()=>setSelected(null)}
>

<img
src={selected}
className="modalImage"
alt=""
/>

</div>

)
}

</div>

)

}
