var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==========================
// Verificar token
// ==========================
exports.verificaToken = function (req, res, next) {


    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                mensaje: 'El token no es válido',
                errors: err
            })
        }

        req.usuario = decoded.usuario;
        
         next(); // Permite que se ejecuten las funciones que siguen abajo

        // res.status(200).json({  ==>  Lo que tenemos en el decoded
        //     ok: true,
        //     decoded: decoded
        // });
    });


}

