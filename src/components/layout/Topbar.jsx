import { useAuth } from '../../context/AuthContext'
import { DISCORD_LOGIN_URL } from '../../services/auth/discordAuth'

export default function Topbar(){

  const { user, logout } = useAuth()

  return(
    <div className="topbar">

      <div className="topbar-title">
        <h2>GRIZZLY RP DASHBOARD</h2>
      </div>

      {
        user ? (
          <div className="auth-user">

            <img
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
            />

            <span>{user.username}</span>

            <button
              className="logout-btn"
              onClick={logout}
            >
              ВЫЙТИ
            </button>

          </div>
        ) : (
          <a
            href={DISCORD_LOGIN_URL}
            className="login-btn"
          >
            ВОЙТИ DISCORD
          </a>
        )
      }

    </div>
  )
}