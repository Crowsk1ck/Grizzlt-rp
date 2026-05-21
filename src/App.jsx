import { Routes, Route, Link } from 'react-router-dom'
import Contracts from './pages/Contracts'

export default function App(){

return(
<>
<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

<nav>
<Link to="/">Contracts Panel</Link>
</nav>

<Routes>
<Route path="/" element={<Contracts />} />
</Routes>
</>
)

}