var mongoose = require('mongoose');

var LegajoSchema = new mongoose.Schema({
    Tipo:String,
    NroLegajo:String,
    NroDocumentos:Number,
    Documentos:[],
    Codigo:String,
    Entidad:String,
    UDireccion:String,
    UOrganica:String,
    UAdministrativa:String,
    Juzgado:String,
    Remitente:String,
    Autor:String,
    Documento:String,
    Descripcion:String,
    SNumerica:{Desde:String,Hasta:String},
    SPeriodica:{FechaInicio:Date,FechaFin:Date},
    Tomos:[{tomo:Number,de:Number}],
    UCreador:String,
    fecha: { type: Date, default: Date.now }
})

mongoose.model('Legajos', LegajoSchema);