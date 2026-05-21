export default function Gallery(){

const images = [

'/assets/gallery/1.jpg',
'/assets/gallery/2.jpg',
'/assets/gallery/3.jpg',
'/assets/gallery/4.jpg',
'/assets/gallery/5.jpg',
'/assets/gallery/6.jpg'

]

return(

<>

<h1 className="title">
GRIZZLY GALLERY
</h1>

<div className="galleryGrid">

{
images.map((img,index)=>(

<div
key={index}
className="galleryCard"
>

<img
src={img}
className="galleryImage"
/>

<div className="galleryOverlay">

<div className="galleryText">
GRIZZLY FAMILY
</div>

</div>

</div>

))
}

</div>

</>

)

}
