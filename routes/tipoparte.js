var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

var TipoPartes = mongoose.model('TipoPartes');


router.get('/tipopartes', function(req,res,next){
    TipoPartes.find(function(err, tipoPartes){
        if (err) { return next(err) }
        res.json(tipoPartes)
    })
})

router.get('/tipoparte/:Nombre', function(req,res,next){
    TipoPartes.find({"Nombre":req.params.Documento},function(err, tipoPartes){
        if (err) { return next(err) }
        res.json(tipoPartes)
    })
})

router.post('/tipoparte', function(req,res,next){
    var tipoParte = new TipoPartes(req.body);
    tipoParte.save(function(err, tipoParte){
        if (err) { return next(err) }
        res.json(tipoParte);
    })
})

router.put('/tipoparte/:id', function(req, res) {
    TipoPartes.findById(req.params.id, function(err, dep) {
        dep.Nombre = req.body.Nombre;
        dep.TipoParte = req.body.TipoParte;
        dep.Especialidad = req.body.Especialidad;
        dep.save(function(err) {
            if (err) { res.send(err) }

            res.json(dep);
        })
    })
})

router.delete('/tipoparte/:id', function(req, res) {
    TipoPartes.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'El tipo parte se ha eliminado' });
    })
})

module.exports = router;