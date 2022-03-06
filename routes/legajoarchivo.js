var express = require('express');
var request = require('request');

var router = express.Router();

var mongoose = require('mongoose');

var LegajoArchivos = mongoose.model('LegajoArchivos');

router.get('/legajoarchivos/:legajo', function(req,res,next){
    Legajos.find({IdLegajo:req.params.legajo},function(err, archivos){
        if (err) { return next(err) }
        res.json(archivos)
    })
})

router.delete('/legajoarchivo/:id', function(req, res) {
    Legajos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'La relacion se ha eliminado' });
    })
})
