var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res)=>{

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve( __dirname, `../uploads/${ tipo }/${ img }`); //Creamos el path de la imagen 
    if( fs.existsSync(pathImagen)){ //Verificamos si existe la imagen
        res.sendFile( pathImagen); // Enviamos la imagen
    }else{
        var pathNoImage = path.resolve( __dirname, '../assets/no-img.jpg');
        res.sendFile( pathNoImage );
    }


});


module.exports = app;