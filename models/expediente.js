var mongoose = require('mongoose');

var ExpedienteSchema = new mongoose.Schema({
    Expediente:String,
    NroExpediente:Number,
    AnioExpediente:Number,
    Materia:String,
    Partes:[],
    UCreador:String,
    fecha: { type: Date, default: Date.now }
})

mongoose.model('Expedientes', ExpedienteSchema);