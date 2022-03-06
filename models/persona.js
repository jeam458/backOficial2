var mongoose = require('mongoose');

var PersonaSchema = new mongoose.Schema({
    Nombre: String,
    ApellidoM:String,
    ApellidoP:String,
    Documento:String,
    TipoDocumento:String,
    Autor:String,
    fecha: { type: Date, default: Date.now }
})

mongoose.model('Personas', PersonaSchema);