var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

var Personas = mongoose.model('Personas');


router.get('/personas', function(req,res,next){
    Personas.find(function(err, personas){
        if (err) { return next(err) }
        res.json(personas)
    })
})

router.get('/persona/:Documento', function(req,res,next){
    Personas.find({"Documento":req.params.Documento},function(err, personas){
        if (err) { return next(err) }
        res.json(personas)
    })
})

router.get('/personadatos/:datos', function(req,res,next){
    var cadena = req.params.datos.toString();
    console.log(cadena);
    var datos = req.params.datos.split(' ');
    console.log(datos)
    if(datos.length === 1){
        Personas.find( {$or:[{Nombre: {"$regex": datos[0], "$options": "i"}},{ ApellidoM: {"$regex": datos[0], "$options": "i"}},{ ApellidoP: {"$regex": datos[0], "$options": "i"}}]} , function(err, personas){
            if (err) { return next(err) }
        res.json(personas)
        })
    } else if(datos.length === 2){
        Personas.find( {$or:[{ ApellidoM: {"$regex": datos[1], "$options": "i"}},{ ApellidoP: {"$regex": datos[1], "$options": "i"}}], $and: [{Nombre: {"$regex": datos[0], "$options": "i"}}]} , function(err, personas){
            if (err) { return next(err) }
        res.json(personas)
        })
    } else if(datos.length === 3){
        Personas.find( {$or:[{ ApellidoM: {"$regex": datos[1], "$options": "i"}},{ ApellidoM: {"$regex": datos[2], "$options": "i"}},{ ApellidoP: {"$regex": datos[1], "$options": "i"}},{ ApellidoP: {"$regex": datos[2], "$options": "i"}}], $and: [{Nombre: {"$regex": datos[0], "$options": "i"}}]} , function(err, personas){
            if (err) { return next(err) }
        res.json(personas)
        })
    } else if(3 < datos.length ){
        Personas.find( {$or:[{ ApellidoM: {"$regex": datos[datos.length-1], "$options": "i"}},{ ApellidoM: {"$regex": datos[datos.length-2], "$options": "i"}},{ ApellidoP: {"$regex": datos[datos.length-1], "$options": "i"}},{ ApellidoP: {"$regex": datos[datos.length-2], "$options": "i"}}], $and: [{Nombre: {"$regex": datos[0], "$options": "i"}}], $or: [{Nombre: {"$regex": datos[0], "$options": "i"}}, {Nombre: {"$regex": datos[1], "$options": "i"}}]} , function(err, personas){
            if (err) { return next(err) }
        res.json(personas)
        })
    } else {
        res.json(datos.length)
    }
})

router.post('/persona', function(req,res,next){
    var persona = new Personas(req.body);
    persona.save(function(err, persona){
        if (err) { return next(err) }
        res.json(persona);
    })
})

router.put('/persona/:id', function(req, res) {
    Personas.findById(req.params.id, function(err, dep) {
        dep.Nombre = req.body.Nombre;
        dep.ApellidoM = req.body.ApellidoM;
        dep.ApellidoP = req.body.ApellidoP;
        dep.Documento = req.body.Documento;
        dep.TipoDocumento = req.body.TipoDocumento;
        dep.save(function(err) {
            if (err) { res.send(err) }

            res.json(dep);
        })
    })
})

router.delete('/persona/:id', function(req, res) {
    Persona.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'La persona se ha eliminado' });
    })
})

module.exports = router;