var express = require('express');
var app = express();
var bcrypt = require('bcryptjs'); // Para encriptar la contraseña

var jwt = require('jsonwebtoken'); 
var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');


// ==========================
// Obtener todos los usuarios
// ==========================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role') // Escojo los campos que quiero
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });
});




// ==========================
// Actualizar un usuario
// ==========================
app.put('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)'; // No estamos guardando el password solo lo mostramos de esta manera

            res.status(200).json({
                ok: true,
                mensaje: 'Usuario Actualizado',
                usuario: usuarioGuardado
            })

        });

    });

});


// ==========================
// Crear un nuevo usuario
// ==========================
app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

    var body = req.body; // Se necesita el bodyparser

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => { //Guardamos el usuario
        if (err) {
            return res.status(400).json({
                ok: false,
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario // El usuario que hizo la solicitud el req.usuario viene de donde lo definimos en autenticacion.js
        });
    });


});

// ============================
// Borrar un usuario por el id
// ============================
app.delete('/:id',mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con es id',
                errors: { message: 'No existe un usuario con ese id' }
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

})



module.exports = app;