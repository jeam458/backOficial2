var mongoose = require('mongoose');

var ActoProcesalSchema = new mongoose.Schema({
    Especialidad: String,
    Organo:String,
    Nombre:String,
    Autor:String,
    fecha: { type: Date, default: Date.now }
})

mongoose.model('ActosProcesales', ActoProcesalSchema);