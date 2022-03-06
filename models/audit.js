var mongoose = require('mongoose');
 var AuditSchema = new mongoose.Schema({
        Fmodificacion: { type: Date, default: Date.now },
        Interface:String,
        IdModificado:String,
        IdModificador:String,
        TipoOperacion:String  //c-create, d-delete, u- update
})

mongoose.model('Audits', AuditSchema);