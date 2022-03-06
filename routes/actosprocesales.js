var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

var ActosProcesales = mongoose.model('ActosProcesales');


router.get('/actos', function(req,res,next){
    ActosProcesales.find(function(err, actos){
        if (err) { return next(err) }
        res.json(actos)
    })
})

router.get('/actos/:Especialidad/:Organo', function(req,res,next){
    ActosProcesales.find({"Especialidad":req.params.Especialidad, "Organo":req.params.Organo},function(err, actos){
        if (err) { return next(err) }
        res.json(actos)
    })
})

router.post('/acto', function(req,res,next){
    var acto = new ActosProcesales(req.body);
    acto.save(function(err, acto){
        if (err) { return next(err) }
        res.json(acto);
    })
})

router.put('/acto/:id', function(req, res) {
    ActosProcesales.findById(req.params.id, function(err, dep) {
        dep.Nombre = req.body.Nombre;
        dep.Organo = req.body.Organo;
        dep.Especialidad = req.body.Especialidad;
        dep.save(function(err) {
            if (err) { res.send(err) }

            res.json(dep);
        })
    })
})

router.delete('/acto/:id', function(req, res) {
    ActosProcesales.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'El acto procesal se ha eliminado' });
    })
})

module.exports = router;