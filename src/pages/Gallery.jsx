import { useState } from 'react'
import './gallery.css'

const categories = [
'ALL',
'WARS',
'CONTRACTS',
'TEAM',
'EVENTS'
]

export default function Gallery(){

const [image,setImage] = useState(null)
const [loading,setLoading] = useState(false)
const [uploaded,setUploaded] = useState([])
const [selected,setSelected] = useState(null)
const [activeCategory,setActiveCategory] = useState('ALL')

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
{
url:file.secure_url,
category:'WARS'
},
...prev
])

}catch(err){

console.log(err)

}

setLoading(false)

}

const filtered =
activeCategory === 'ALL'
? uploaded
: uploaded.filter(
x=>x.category === activeCategory
)

return(

<div className="galleryPage">

<div className="galleryHero">

<div>

<h1 className="galleryTitle">
MEDIA HUB
</h1>

<p className="gallerySubtitle">
GRIZZLY FAMILY • GTA RP GALLERY
</p>

</div>

<div className="galleryStats">

<div className="galleryStat">
<h2>{uploaded.length}</h2>
<span>UPLOADS</span>
</div>

<div className="galleryStat">
<h2>LIVE</h2>
<span>CLOUD</span>
</div>

</div>

</div>

<div className="uploadSection">

<label className="uploadZone">

<input
type="file"
accept="image/*"
onChange={(e)=>setImage(e.target.files[0])}
hidden
/>

<div className="uploadInner">

<div className="uploadIcon">
⬆
</div>

<h2>DRAG & DROP MEDIA</h2>

<p>
Upload screenshots, wars, contracts and GTA moments
</p>

<button
className="uploadBtn"
onClick={uploadImage}
>

{loading ? 'UPLOADING...' : 'UPLOAD IMAGE'}

</button>

</div>

</label>

</div>

<div className="categories">

{
categories.map(cat=>(

<button
key={cat}
className={
activeCategory === cat
? 'category activeCategory'
: 'category'
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
filtered.map((item,index)=>(

<div
key={index}
className="mediaCard"
onClick={()=>setSelected(item.url)}
>

<img
src={item.url}
alt=""
className="mediaImage"
/>

<div className="mediaOverlay">

<div>

<div className="mediaBadge">
{item.category}
</div>

<h3 className="mediaTitle">
GRIZZLY RP
</h3>

</div>

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
alt=""
className="modalImage"
/>

</div>

)
}

</div>

)

}
