var express = require('express');
var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');


// ==========================
// Obtener todos los hospitales
// ==========================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email') // Nos permite ver los campos del usuario que lo ha creado
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar hospital',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales
                    });
                });


            });
});




// ==========================
// Actualizar un hospital
// ==========================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id; // Grabamos el id del usuario que lo ha creado

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            // No estamos guardando el password solo lo mostramos de esta manera

            res.status(200).json({
                ok: true,
                mensaje: 'Hospital Actualizado',
                hospital: hospitalGuardado
            })

        });

    });

});


// ==========================
// Crear un nuevo hospital
// ==========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body; // Se necesita el bodyparser

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => { //Guardamos el hospital
        if (err) {
            return res.status(400).json({
                ok: false,
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
        });
    });


});

// ============================
// Borrar un usuario por el id
// ============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con es id',
                errors: { message: 'No existe un hospital con ese id' }
            })
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Hospital borrado correctamente',
            hospital: hospitalBorrado
        });
    });

})



module.exports = app;