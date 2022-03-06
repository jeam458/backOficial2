var mongoose = require('mongoose');
 var TipoParteSchema = new mongoose.Schema({
    Nombre: String,
    TipoParte:String,      
    Especialidad:String,
    Autor:String,
    fecha:{ type: Date, default: Date.now }
})

mongoose.model('TipoPartes', TipoParteSchema);