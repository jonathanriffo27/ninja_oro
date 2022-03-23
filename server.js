const express = require('express')
const nunjucks = require('nunjucks')
const session = require('express-session')
const crypto = require('crypto')
const moment = require("moment");
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
  if (!req.session.actividades) {
    req.session.actividades = []
  }
  if (!req.session.suma) {
    req.session.suma = 0
  }
  
  // console.log(color)
  res.render('ninja.html',{actividades: req.session.actividades, suma: req.session.suma });
})
app.post('/gold/process_money', async (req, res) => {
  let resultado = 0
  if(req.query.lugar == "Granja"){
     resultado = await azar(10, 20)
  }else if(req.query.lugar == "Cueva"){
    resultado = await azar(5, 10)
  }else if(req.query.lugar == "Casa"){
    resultado = await azar(2, 5)
  }else if(req.query.lugar == "Casino"){
    resultado = await azar(-50, 50)
  }
  // 1 Le sumo la nueva canridad de oro a lo que ya tengo
  let text = ""
  let color = ''
  let fecha = moment().format("MMMM Do YYYY, h:mm:ss a");

  if(resultado >= 0){
    text = `Ha ganado ${resultado} ${fecha}` 
    color = "text-success fs-6"
  }else{
    text = `Ha perdido ${resultado} ${fecha}` 
    color = "text-danger fs-6"
  }
  req.session.actividades.push({
    text,
    color
  })
  // 2. Agrego un nuevo texto a las actividades
  req.session.suma += resultado
  res.redirect('/gold')
})



const PORT = 3000
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`))