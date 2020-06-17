var express = require('express');
var app = express();

app.get('/', (req, res)=>{

    res.status(200).json({
        ok: true,
        mensaje: 'Funciona Bien!'
    });

});


module.exports = app;