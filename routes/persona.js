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