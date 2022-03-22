const express = require('express')
const nunjucks = require('nunjucks')
const session = require('express-session')
const crypto = require('crypto')

const app = express()

// Configuraciones estáticos
app.use(express.static('public'))
app.use(express.static('node_modules/bootstrap/dist'))

// se configura nunjucks
nunjucks.configure("templates", {
  express: app,
  autoscape: true,
  watch: true,
});

// configuraciones de formulario
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// configuración de sessiones
app.use(session({
  secret: 'mi-clave',
  cookie: { maxAge: 1000*60*60*24 }
}))

// RUTAS
app.get('/random', (req, res) => {
  if (!req.session.palabras) {
    req.session.palabras = []
  }
  const palabra = crypto.randomBytes(7).toString('hex')
  res.render('index.html',{palabra});
})
app.get('/random/reset', (req, res) => {
  req.session.palabras.push()

  res.redirect('/random')
})
app.get('/gold', (req, res) => {
  if (!req.session.palabras) {
    req.session.palabras = []
  }
  const palabra = crypto.randomBytes(7).toString('hex')
  res.render('ninja.html',{palabra});
})
app.post('/gold/precess_money', (req, res) => {
  if (!req.session.palabras) {
    req.session.palabras = []
  }
  const palabra = crypto.randomBytes(7).toString('hex')
  res.render('ninja.html',{palabra});
})



const PORT = 3000
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`))