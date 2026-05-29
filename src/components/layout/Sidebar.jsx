import {

  LayoutDashboard,
  Users,
  ScrollText,
  BarChart3,
  Shield,
  Trophy,
  Calendar,
  Image

} from 'lucide-react'

import {

  useEffect,
  useState

} from 'react'

import {

  Link,
  useLocation

} from 'react-router-dom'

import '../../styles/sidebar.css'

export default function Sidebar({

  isAdmin

}){

  const [user,setUser] =
    useState(null)

  const location =
    useLocation()

  useEffect(()=>{

    const token =
      localStorage.getItem(
        'discord_token'
      )

    if(token){

      fetch(
        'https://discord.com/api/users/@me',
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )
      .then(res=>res.json())
      .then(data=>{

        setUser(data)

      })

    }

  },[])

  const navItems = [

    {
      path:'/',
      title:'Dashboard',
      icon:<LayoutDashboard size={20}/>
    },

    {
      path:'/team',
      title:'Team',
      icon:<Users size={20}/>
    },

    {
      path:'/contracts',
      title:'Contracts',
      icon:<ScrollText size={20}/>
    },

    {
      path:'/statistics',
      title:'Statistics',
      icon:<BarChart3 size={20}/>
    },

    {
      path:'/gallery',
      title:'Gallery',
      icon:<Image size={20}/>
    },

    {
      path:'/liders',
      title:'Liders',
      icon:<Trophy size={20}/>
    }

  ]

  if(isAdmin){

    navItems.push({

      path:'/admin',
      title:'Admin',
      icon:<Shield size={20}/>

    })

  }

  return(

    <aside className="sidebar">

      <div className="sidebar-top">

        <div className="sidebar-logo">

          <div className="logo-glow"></div>

          <h1>
            GRIZZLY
          </h1>

          <span>
            FAMILY
          </span>

        </div>

        {
          user && (

            <div className="sidebar-profile">
<button
  className="sidebar-logout"
  onClick={() => {

    localStorage.removeItem(
      'discord_token'
    )

    localStorage.removeItem(
      'discord_user'
    )

    window.location.reload()

  }}
>
  ВИЙТИ
</button>
              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt=""
              />

              <div>

                <h3>
                  {user.username}
                </h3>

                <span>
                  MEMBER
                </span>

              </div>

            </div>

          )
        }

      </div>

      <div className="sidebar-nav">

        {navItems.map((item)=>(

          <Link
            key={item.path}
            to={item.path}
            className={
              location.pathname === item.path
              ? 'sidebar-link active'
              : 'sidebar-link'
            }
          >

            <div className="sidebar-icon">

              {item.icon}

            </div>

            <span>
              {item.title}
            </span>

          </Link>

        ))}

      </div>

      <div className="sidebar-bottom">

        <div className="family-online">

          <div className="online-dot"></div>

          <span>
            
          </span>

        </div>

      </div>

    </aside>

  )

}
