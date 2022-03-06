var mongoose = require('mongoose');
var StockProductoSchema = new mongoose.Schema({
    Codigo: String,
    CodProducto: String,
    CodigoBarra: String,
    Producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
    Nombre: String,
    Proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores' },
    Sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales' },
    Stock: Number,
    Cantidad: Number,
    EstadoStock: Number,
    UMedida: String,
    PC: Number,
    PV: Number,
    fecha: { type: Date, default: Date.now }
});
mongoose.model('StrockProducto', StockProductoSchema);