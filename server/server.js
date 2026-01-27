require('dotenv').config()
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/routerTemplate'
const PORT = process.env.PORT || 5000


const express = require('express')
const app = express()


// Connecting to Database
const mongoose = require('mongoose')
mongoose.connect(DATABASE_URL)
const db = mongoose.connection
db.on('error', (err) => console.error('Database Connection Unsuccessful \n\n', err))
db.once('open', () => console.log('Database Connection Successful'))


// Middleware
app.use(express.json())


// Routing
const routerTemplate = require('./routes/routerTemplate')
app.use('/routerTemplate', routerTemplate) // localhost:3000/routerTemplate/...


// Setting Port
app.listen(PORT, (err) => {
  if (err) {
    console.log('ERROR in running the server \n\n', err)
  }
  else {
    console.log('Server running on http://localhost:' + PORT);
  }
});