const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');
  
//crear el servidopr de express
const app = express();

//Base de Datos
dbConnection();

//CORS
app.use( cors() );

//directorio publico
app.use( express.static( 'public' ) );

//lectura y parseo del body
app.use( express.json() );


//rutas         //request y response 
//TODO: auth // crear usuarios, login, renew Token
app.use('/api/auth', require('./routes/auth'));
//TODO: CRUD: Events - routes
app.use('/api/events', require('./routes/events'));




//escuchar peticiones
app.listen(  process.env.PORT, () => {
    console.log( `Servidor corriendo en puerto ${ process.env.PORT }` );
} );