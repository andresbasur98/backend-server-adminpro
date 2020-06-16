// Requires
var express = require('express');
var mongoose = require('mongoose')
;

// Inicializar variables
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res )=>{

    if( err ) throw err; 

    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
})

// Rutas
app.get('/', (req, res)=>{

    res.status(200).json({
        ok: true,
        mensaje: 'Funciona Bien!'
    });

});


// Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online'); // Los caracteres cambian de color verde lo que tenemos a su derecha
});