var express = require('express');
var request = require('request');

var router = express.Router();

var mongoose = require('mongoose');

var Expedientes = mongoose.model('Expedientes');


router.get('/expedientes', function(req,res,next){
    Expedientes.find(function(err, expedientes){
        if (err) { return next(err) }
        res.json(expedientes)
    })
})


router.get('/expediente/:Tipo', function(req,res,next){
    Expedientes.find({Tipo:req.params.Tipo},function(err, expedientes){
        if (err) { return next(err) }
        res.json(expedientes)
    })
})

router.post('/expediente', function(req,res,next){
    var dependencia = new Expedientes(req.body);
    dependencia.save(function(err, expedientes){
        if (err) { return next(err) }
        res.json(expedientes);
    })
})

router.put('/expediente/:id', function(req, res) {
    Expedientes.findById(req.params.id, function(err, exp) {
        exp.Expediente = req.body.Expediente;
        exp.NroExpediente = req.body.NroExpediente;
        exp.AnioExpediente = req.body.AnioExpediente;
        exp.Materia = req.body.Materia;
        exp.Partes = req.body.Partes; 
        dep.save(function(err) {
            if (err) { res.send(err) }

            res.json(dep);
        })
    })
})

router.delete('/expediente/:id', function(req, res) {
    Expedientes.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'El expediente se ha eliminado' });
    })
})

module.exports = router;