import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import App from './App'

import './styles/global.css'
import './styles/animations.css'
import './styles/responsive.css'
import './styles/skeleton.css'
import './styles/global.css'
import './styles/sidebar.css'
import './styles/dashboard.css'

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <BrowserRouter>

    <App />

    <Toaster
      position="top-right"

      toastOptions={{

        style:{

          background:'#0b0b11',

          color:'#fff',

          border:
            '1px solid rgba(255,0,92,.25)',

          borderRadius:'18px',

          padding:'16px',

          fontWeight:'700'
        },

        success:{

          iconTheme:{

            primary:'#ff0066',

            secondary:'#fff'
          }

        },

        error:{

          iconTheme:{

            primary:'#ff3d3d',

            secondary:'#fff'
          }

        }

      }}
    />

  </BrowserRouter>

)
