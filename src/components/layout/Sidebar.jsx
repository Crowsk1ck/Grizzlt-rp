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

import '../../styles/sidebar.css'

export default function Sidebar({

  active,
  setActive

}){

  const [user,setUser] = useState(null)

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
      id:'dashboard',
      title:'Dashboard',
      icon:<LayoutDashboard size={20}/>
    },

    {
      id:'team',
      title:'Team',
      icon:<Users size={20}/>
    },

    {
      id:'contracts',
      title:'Contracts',
      icon:<ScrollText size={20}/>
    },

    {
      id:'statistics',
      title:'Statistics',
      icon:<BarChart3 size={20}/>
    },

    {
      id:'gallery',
      title:'Gallery',
      icon:<Image size={20}/>
    },

    {
      id:'calendar',
      title:'Calendar',
      icon:<Calendar size={20}/>
    },

    {
      id:'achievements',
      title:'Achievements',
      icon:<Trophy size={20}/>
    },

    {
      id:'admin',
      title:'Admin',
      icon:<Shield size={20}/>
    }

  ]

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

              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt=""
              />

              <div>

                <h3>
                  {user.username}
                </h3>

                <span>
                  LEADER
                </span>

              </div>

            </div>

          )
        }

      </div>

      <div className="sidebar-nav">

        {navItems.map((item)=>(

          <button
            key={item.id}
            onClick={()=>
              setActive(item.id)
            }
            className={
              active === item.id
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

          </button>

        ))}

      </div>

      <div className="sidebar-bottom">

        <div className="family-online">

          <div className="online-dot"></div>

          <span>
            48 MEMBERS ONLINE
          </span>

        </div>

      </div>

    </aside>

  )

}
