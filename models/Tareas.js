var mongoose = require('mongoose');
var TareasSchema = new mongoose.Schema({
    nombre: String,
    descripcion:String,
    tipo:[],
    prioridad: Number,//0,1,2,3
    estado:Number, //0,1
    fecha: { type: Date, default: Date.now },
    fechafin:Date,
    responsable: String
});
mongoose.model('Tareas', TareasSchema);