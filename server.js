const express = require('express')
const nunjucks = require('nunjucks')
const session = require('express-session')
const crypto = require('crypto')
const {azar, resultado} = require('./db.js')

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
  if (!req.session.oro) {
    req.session.oro = []
  }
  const oro = req.session.oro
  let suma = 0;
  for(i=0; i<oro.length; i++){
    suma += oro[i]
  }
  // console.log(oro)
  res.render('ninja.html',{suma, oro});
})
app.post('/gold/process_money', async (req, res) => {
  const resultado = await azar(parseInt(req.body.min), parseInt(req.body.max))
  req.session.oro.push(resultado)
  res.redirect('/gold')
})



const PORT = 3000
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`))