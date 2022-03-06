var express = require('express');
var request = require('request');

var router = express.Router();

var mongoose = require('mongoose');

var Legajos = mongoose.model('Legajos');


router.get('/legajos', function(req,res,next){
    Legajos.find(function(err, legajos){
        if (err) { return next(err) }
        res.json(legajos)
    })
})


router.get('/legajoEXP/:Expediente', function(req,res,next){
    Legajos.find({Expediente:req.params.Expediente},function(err, legajos){
        if (err) { return next(err) }
        res.json(legajos)
    })
})

router.post('/legajo', function(req,res,next){
    var dependencia = new Legajos(req.body);
    dependencia.save(function(err, legajos){
        if (err) { return next(err) }
        res.json(legajos);
    })
})

router.put('/legajo/:id', function(req, res) {
    Legajos.findById(req.params.id, function(err, legajo) {
        legajo.Tipo = req.body.Tipo;
        legajo.Expediente = req.body.Expediente;
        legajo.NroLegajo = req.body.NroLegajo;
        legajo.NroDocumentos = req.body.NroDocumentos;
        legajo.Codigo = req.body.Codigo;
        legajo.Entidad = req.body.Entidad;
        legajo.UDireccion = req.body.UDireccion;
        legajo.UOrganica = req.body.UOrganica;
        legajo.UAdministrativa = req.body.UAdministrativa;
        legajo.Juzgado = req.body.Juzgado;
        legajo.Remitente = req.body.Remitente;
        legajo.Autor = req.body.Autor;
        legajo.Documento = req.body.Documento;
        legajo.Descripcion = req.body.Descripcion;
        legajo.SNumerica = req.body.SNumerica;
        legajo.SPeriodica = req.body.SPeriodica;
        legajo.Tomos = req.body.Tomos;
        legajo.save(function(err) {
            if (err) { res.send(err) }

            res.json(legajo);
        })
    })
})

router.put('/legajoDocumento/:id', function(req, res) {
    Legajos.findById(req.params.id, function(err, legajo) {
        var documentos=[];
        documentos = legajo.Documento;
        documentos.push(req.body.Expediente);
        legajo.Documentos = documentos;
        legajo.save(function(err) {
            if (err) { res.send(err) }
            res.json(legajo);
        })
    })
})

router.delete('/legajo/:id', function(req, res) {
    Legajos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'El Legajo se ha eliminado' });
    })
})

module.exports = router;