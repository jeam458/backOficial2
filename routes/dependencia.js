var express = require('express');
var request = require('request');

var router = express.Router();

var mongoose = require('mongoose');

var Dependencias = mongoose.model('Dependencias');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/dependencias', function(req,res,next){
    Dependencias.find(function(err, dependencias){
        if (err) { return next(err) }
        res.json(dependencias)
    })
})

router.get('/dependencia/:Referencia', function(req,res,next){
    Dependencias.find({"Referencia":req.params.Referencia},function(err, dependencias){
        if (err) { return next(err) }
        res.json(dependencias)
    })
})

router.get('/dependencias/:Tipo', function(req,res,next){
    Dependencias.find({"Tipo":req.params.Tipo},function(err, dependencias){
        if (err) { return next(err) }
        res.json(dependencias)
    })
})

router.get('/deptipo/:Tipo', function(req,res,next){
    Dependencias.find({Tipo:req.params.Tipo},function(err, dependencias){
        if (err) { return next(err) }
        res.json(dependencias)
    })
})

router.post('/dependencia', function(req,res,next){
    var dependencia = new Dependencias(req.body);
    dependencia.save(function(err, dependencia){
        if (err) { return next(err) }
        res.json(dependencia);
    })
})

router.put('/dependencia/:id', function(req, res) {
    Dependencias.findById(req.params.id, function(err, dep) {
        dep.Nombre = req.body.Nombre;
        dep.Tipo = req.body.Tipo;
        dep.Descripcion = req.body.Descripcion;
        dep.Referencia = req.body.Referencia;
        dep.Organo = req.body.Organo;
        dep.save(function(err) {
            if (err) { res.send(err) }

            res.json(dep);
        })
    })
})

router.delete('/dependencia/:id', function(req, res) {
    Dependencias.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'La dependencia se ha eliminado' });
    })
})

module.exports = router;

