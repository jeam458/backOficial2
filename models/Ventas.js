var mongoose = require('mongoose');
var VentasSchema = new mongoose.Schema({
    NroFactura: Number,
    IdCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Clientes' },
    NombreCliente: String,
    Dni: Number,
    RUC: Number,
    Telefono: String,
    Email: String,
    IdVendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' },
    NombreVendedor: String,
    IdSucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales' },
    NombreSucursal: String,
    fecha: { type: Date, default: Date.now },
    TipoPago: Number,
    Estado: Number,
    Productos: [{
        Codigo: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
        CodigoBarra: String,
        CodProducto:String,
        Nombre: String,
        Cantidad: Number,
        UMedida: String,
        PrecioUnitario: Number,
        PrecioTotal: Number
    }],
    SubTotal: Number,
    IGV: Number,
    Total: Number
});
mongoose.model('Ventas', VentasSchema)