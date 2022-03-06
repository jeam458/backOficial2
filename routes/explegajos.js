var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

var ExpedienteLegajos = mongoose.model('ExpedienteLegajos');
var LegajoArchivos = mongoose.model('LegajoArchivos');

router.get('/legajos/:Expediente', function(req,res,next){
    ExpedienteLegajos.find({"IdExpediente":req.params.Expediente},function(err, legajos){
        if (err) { return next(err) }
        res.json(legajos)
    })
})

router.get('/Expedientes/:Legajos', function(req,res,next){
    ExpedienteLegajos.find({"IdLegajo":req.params.Legajos},function(err, expedientes){
        if (err) { return next(err) }
        res.json(expedientes)
    })
})

router.post('/expleg', function(req,res,next){
    var expleg = new ExpedienteLegajos(req.body);
    expleg.save(function(err, expleg){
        if (err) { return next(err) }
        res.json(expleg);
    })
})

router.delete('/expleg/:id', function(req, res) {
    ExpedienteLegajos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'la relación se ha eliminado' });
    })
})


router.get('/Legajos/:Archivo', function(req,res,next){
    LegajoArchivos.find({"IdArchivo":req.params.Archivo},function(err, Archivos){
        if (err) { return next(err) }
        res.json(Archivos)
    })
})

router.post('/legarchivo', function(req,res,next){
    var expleg = new LegajoArchivos(req.body);
    expleg.save(function(err, expleg){
        if (err) { return next(err) }
        res.json(expleg);
    })
})

router.delete('/legarchivo/:id', function(req, res) {
    LegajoArchivos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'la relación se ha eliminado' });
    })
})




