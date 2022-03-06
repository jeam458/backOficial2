var mongoose = require('mongoose');
 var DependenciaSchema = new mongoose.Schema({
    Nombre: String,
    Tipo:String,      // oj-jurisdiccional, oa-administrativo
    Organo:String,
    Descripcion:String,
    Referencia:String,
    Autor:String,
    fecha:{ type: Date, default: Date.now }
})

mongoose.model('Dependencias', DependenciaSchema);