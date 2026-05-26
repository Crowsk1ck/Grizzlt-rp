export const DISCORD_CLIENT_ID = '1508833507894624399'

export const DISCORD_LOGIN_URL =
`https://discord.com/oauth2/authorize?client_id=1508833507894624399&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online&scope=identify`

export async function checkRole(discordId){

  const response = await fetch(
    'http://localhost:3001/api/check-role',
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        discordId
      })
    }
  )

  return await response.json()
}
