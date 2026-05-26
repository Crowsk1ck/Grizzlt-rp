import { useAuth } from '../../context/AuthContext'
import {
  DISCORD_LOGIN_URL
} from '../../services/auth/discordAuth'

export default function Topbar(){

  const { user, logout } = useAuth()

  return(
    <header className="topbar">

      <div>
        <h2>GRIZZLY FAMILY</h2>
        <p>Premium GTA RP ecosystem</p>
      </div>

      {
        user ? (
          <div className="auth-user">

            <img
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
              alt=""
            />

            <span>{user.username}</span>

            <button
              className="secondary-btn"
              onClick={logout}
            >
              ВЫЙТИ
            </button>

          </div>
        ) : (
          <a
            href={DISCORD_LOGIN_URL}
            className="primary-btn auth-link"
          >
            ВОЙТИ ЧЕРЕЗ DISCORD
          </a>
        )
      }

    </header>
  )
}