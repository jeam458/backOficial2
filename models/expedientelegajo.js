var mongoose = require('mongoose');

var ExpLegajoSchema = new mongoose.Schema({
    IdLegajo:String,
    IdExpediente:String,
    UCreador:String,
    fecha: { type: Date, default: Date.now }
})

mongoose.model('ExpedienteLegajos', ExpLegajoSchema);