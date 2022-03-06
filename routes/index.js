//import { read } from 'fs';

var express = require('express');
var Request = require('request');
var router = express.Router();

var multiparty = require('connect-multiparty')();
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Gridfs = require('gridfs-stream');

var Tareas = mongoose.model('Tareas');
var Tipos = mongoose.model('Tipos');
var Clientes = mongoose.model('Clientes');
var Proveedores = mongoose.model('Proveedores');
var Sucursales = mongoose.model('Sucursales');
var Productos = mongoose.model('Productos');
var StocksProductos = mongoose.model('StrockProducto');
var Ventas = mongoose.model('Ventas');
var Transferencias = mongoose.model('Transferencias');
var Accesos = mongoose.model('Accesos');



//inicio metodos para las imagenes

router.post('/upload/:id', multiparty, function(req, res, next) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    var writestream = gfs.createWriteStream({
        filename: req.files.file.name,
        mode: 'w',
        content_type: req.files.file.mimetype,
        metadata: req.body
    })
    fs.createReadStream(req.files.file.path).pipe(writestream);

    writestream.on('close', function(file) {
        Productos.findById(req.params.id, function(err, producto) {
            eliminar(producto.imagen);
            producto.imagen = file._id;
            producto.save(function(err, updateproducto) {
                return res.json(200, updateproducto)
            })
        })
        fs.unlink(req.files.file.path, function(err) {
            console.log('success')
        })
    })
})

router.get('/descargar/:id', function(req, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    var readstream = gfs.createReadStream({
        _id: req.params.id
    })
    readstream.on('error', function(err) {
        res.send('no existe imagen')
    })
    readstream.pipe(res);
    //console.log(res)

})

function eliminar(id, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    gfs.exist({ _id: id }, function(err, found) {
        if (err) return { mensaje: "error ocurrido" };
        if (found) {
            gfs.remove({ _id: id }, function(err) {
                if (err) return { mensaje: "error ocurrido" }; { mensaje: "imagen elimnada" };
            })
        } else {
            { mensaje: "no existe imagen con ese id" };
        }
    })
}

router.get('/eliminar/:id', function(req, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    gfs.exist({ _id: re.params.id }, function(err, found) {
        if (err) return res.send("error ocurrido");
        if (found) {
            gfs.remove({ _id: req.params.id }, function(err) {
                if (err) return res.send("error ocurrido");
                res.send("imagen elimnada")
            })
        } else {
            res.send("no existe imagen con ese id");
        }
    })
})


//fin metodos para las imagenes


//GET - Listar todos
router.get('/tareas', function(req, res, next) {
    Tareas.find(function(err, tareas) {
        if (err) { return next(err) }
        res.json(tareas)
    })
})

router.get('/tpendientes',function(req,res,next){
    Tareas.find({"estado":0},function(err,tareas){
        if(err){return next(err)}
        res.json(tareas);
    })
})
router.get('/tenproceso',function(req,res,next){
    Tareas.find({"estado":1},function(err,tareas){
        if(err){return next(err)}
        res.json(tareas);
    })
})
router.get('/tconcluidos',function(req,res,next){
    Tareas.find({"estado":2},function(err,tareas){
        if(err){return next(err)}
        res.json(tareas);
    })
})
router.get('/tareasestado/:user/:estado',function(req,res,next){
    Tareas.find({"responsable":req.params.user,"estado":req.params.estado},function(err,tareas){
        if(err){return next(err)}
        res.json(tareas);
    })
})

router.get('/tareasuser/:user',function(req,res,next){
    Tareas.find({"responsable":req.params.user},function(err,tareas){
        if(err){return next(err)}
        res.json(tareas);
    })
})

router.get('/tareas/id',function(req,res,next){
    Tareas.find({_id:req.params.id},function(err, tareas){
        if (err) { return next(err) }
        res.json(tareas)
    })
})

router.get('/tipos', function(req, res, next) {
    Tipos.find(function(err, tipos) {
        if (err) { return next(err) }
        res.json(tipos);
    })
})

router.get('/clientes', function(req, res, next) {
    Clientes.find(function(err, clientes) {
        if (err) { return next(err) }
        res.json(clientes);
    })
})
router.get('/proveedores', function(req, res, next) {
    Proveedores.find(function(err, proveedores) {
        if (err) { return next(err) }
        res.json(proveedores);
    })
})
router.get('/sucursales', function(req, res, next) {
    Sucursales.find(function(err, sucursales) {
        if (err) { return next(err) }
        res.json(sucursales);
    })
})
router.get('/productos', function(req, res, next) {
    Productos.find(function(err, productos) {
        if (err) { return next(err) }
        res.json(productos);
    })
})
router.get('/stockproductos', function(req, res, next) {
    StocksProductos.find(function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos);
    })
});
router.get('/stockproductoFechas4/:sucursal', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ Sucursal: req.params.sucursal }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas3/:proveedor', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ Proveedor: req.params.proveedor }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas2/:sucursal/:proveedor', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ Sucursal: req.params.sucursal, Proveedor: req.params.proveedor }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas1/:startDate/:endDate', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate } }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas/:startDate/:endDate/:sucursal/:proveedor', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate }, Sucursal: req.params.sucursal, Proveedor: req.params.proveedor }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas5/:startDate/:endDate/:sucursal', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate }, Sucursal: req.params.sucursal }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas6/:startDate/:endDate/:proveedor', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate }, Proveedor: req.params.proveedor }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductosCount', function(req, res, next) {
    StocksProductos.count(function(err, c) {
        if (err) { return next(err) }
        console.log(c);
        res.json({ conteo: c });
    })
});
router.get('/productoxsucursal/:id', function(req, res, next) {
    StocksProductos.find({ Sucursal: req.params.id }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos);
    })
})
router.get('/ventas', function(req, res, next) {
    Ventas.find(function(err, ventas) {
        if (err) { return next(err) }
        res.json(ventas);
    })
})
router.get('/ventasCount', function(req, res, next) {
    Ventas.count(function(err, c) {
        if (err) { return next(err) }
        console.log(c);
        res.json({ conteo: c });
    })
});
router.get('/transferencias', function(req, res, next) {
    Transferencias.find(function(err, transferencias) {
        if (err) { return next(err) }
        res.json(transferencias);
    })
})
router.get('/transferenciasCount', function(req, res, next) {
    Transferencias.count(function(err, c) {
        if (err) { return next(err) }
        console.log(c);
        res.json({ conteo: c });
    })
});
router.get('/accesos', function(req, res, next) {
        Accesos.find(function(err, accesos) {
            if (err) { return next(err) }
            res.json(accesos);
        })
    })
    //POST - Agregar todos
router.post('/tarea', function(req, res, next) {
    var tarea = new Tareas(req.body);
    tarea.save(function(err, tarea) {
        if (err) { return next(err) }
        res.json(tarea);
    })
})

router.post('/tipo', function(req, res, next) {
    var tipo = new Tipos(req.body);
    tipo.save(function(err, tipo) {
        if (err) { return next(err) }
        res.json(tipo);
    })
})
router.post('/cliente', function(req, res, next) {
    var cliente = new Clientes(req.body);
    cliente.save(function(err, cliente) {
        if (err) { return next(err) }
        res.json(cliente);
    })
})
router.post('/proveedor', function(req, res, next) {
    var proveedor = new Proveedores(req.body);
    proveedor.save(function(err, proveedor) {
        if (err) { return next(err) }
        res.json(proveedor);
    })
})
router.post('/sucursal', function(req, res, next) {
    var sucursal = new Sucursales(req.body);
    sucursal.save(function(err, sucursal) {
        if (err) { return next(err) }
        res.json(sucursal);
    })
})
router.post('/producto', function(req, res, next) {
    var producto = new Productos(req.body);
    producto.save(function(err, producto) {
        if (err) { return next(err) }
        res.json(producto);
    })
})




/*function contaar() {
    return StocksProductos.count(function(err, c) {
        if (!err) {
            console.log(c);
            return c;
        }
    });
}*/


router.post('/stockproducto', function(req, res, next) {
    var stockproducto = new StocksProductos(req.body);
    stockproducto.save(function(err, stockproducto) {
        if (err) { return next(err) }
        res.json(stockproducto);
    });

});
router.post('/transferencia', function(req, res, next) {
    var transferencia = new Transferencias(req.body);
    transferencia.save(function(err, transferencia) {
        if (err) { return next(err) }
        res.json(transferencia);
    })
})
router.post('/venta', function(req, res, next) {
    var venta = new Ventas(req.body);
    venta.save(function(err, venta) {
        if (err) { return next(err) }
        res.json(venta);
    })
})
router.post('/acceso', function(req, res, next) {
    var acceso = new Accesos(req.body);
    acceso.save(function(err, acceso) {
        if (err) { return next(err) }
        res.json(acceso);
    })
})


//PUT - Actualizar todos
router.put('/tarea/:id', function(req, res) {
    Tareas.findById(req.params.id, function(err, tarea) {
        tarea.nombre = req.body.nombre;
        tarea.prioridad = req.body.prioridad;
        tarea.responsable = req.body.responsable;
        tarea.descripcion = req.body.descripcion;
        tarea.estado=req.body.estado;
        tarea.fechafin=Date.now();
        tarea.save(function(err) {
            if (err) { res.send(err) }

            res.json(tarea);
        })
    })
})
router.get('/Dni/:dni', function(req, res) {
    Request.get("http://api.grupoyacck.com/dni/" + req.params.dni, function(error, response, body) {
        if (error) { res.send(error) }
        //console.log(body)
        var retornar = JSON.parse(body);
        res.json(retornar);
    })
})
router.get('/Ruc/:ruc', function(req, res) {
    //console.log(req.params.ruc)
    Request.get("http://api.grupoyacck.com/ruc/" + req.params.ruc + "/?force_update=1", function(error, response, body) {
        if (error) { res.send(error) }
        var retornar = JSON.parse(body);
        res.json(retornar);
    })
})
router.put('/tipo/:id', function(req, res) {
    Tipos.findById(req.params.id, function(err, tipo) {
        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion;
        tipo.save(function(err) {
            if (err) { res.send(err) }
            res.json(tipo);
        })
    })
})
router.put('/cliente/:id', function(req, res) {
    Clientes.findById(req.params.id, function(err, cliente) {
        cliente.Tipo = req.body.Tipo;
        cliente.Dni = req.body.Dni;
        cliente.Ruc = req.body.Ruc;
        cliente.Nombre = req.body.Nombre;
        cliente.AP = req.body.AP;
        cliente.AM = req.body.AM;
        cliente.Gerente = req.body.Gerente;
        cliente.Direccion = req.body.Direccion;
        cliente.Referencia = req.body.Referencia;
        cliente.Correo = req.body.Correo;
        cliente.Celular = req.body.Celular;
        cliente.Telefono = req.body.Telefono;
        cliente.Telefono1 = req.body.Telefono1;
        cliente.save(function(err) {
            if (err) { res.send(err) }
            res.json(cliente);
        })
    })
})
router.put('/proveedor/:id', function(req, res) {
    Proveedores.findById(req.params.id, function(err, proveedor) {
        proveedor.tipo = req.body.tipo;
        proveedor.Dni = req.body.Dni;
        proveedor.Ruc = req.body.Ruc;
        proveedor.Nombre = req.body.Nombre;
        proveedor.AP = req.body.AP;
        proveedor.AM = req.body.AM;
        proveedor.Gerente = req.body.Gerente;
        proveedor.Direccion = req.body.Direccion;
        proveedor.Referencia = req.body.Referencia;
        proveedor.Correo = req.body.Correo;
        proveedor.Celular = req.body.Celular;
        proveedor.Telefono = req.body.Telefono;
        proveedor.Telefono1 = req.body.Telefono1;
        proveedor.Estado = req.body.Estado;
        proveedor.save(function(err) {
            if (err) { res.send(err) }
            res.json(proveedor);
        })
    })
})
router.put('/sucursal/:id', function(req, res) {
    Sucursales.findById(req.params.id, function(err, sucursal) {
        sucursal.tipo = req.body.tipo;
        sucursal.Nombre = req.body.Nombre;
        sucursal.Direccion = req.body.Direccion;
        sucursal.Referencia = req.body.Referencia;
        sucursal.Gerente = req.body.Gerente;
        sucursal.Encargado = req.body.Encargado;
        sucursal.Telefono1 = req.body.Telefono1;
        sucursal.Telefono2 = req.body.Telefono2;
        sucursal.save(function(err) {
            if (err) { res.send(err) }
            res.json(sucursal);
        })
    })
})
router.put('/producto/:id', function(req, res) {
    Productos.findById(req.params.id, function(err, producto) {
        producto.CodigoBarra = req.body.CodigoBarra;
        producto.tipo = req.body.tipo;
        producto.Codigo = req.body.Codigo;
        producto.Nombre = req.body.Nombre;
        producto.Descripcion = req.body.Descripcion;
        producto.Proveedor = req.body.Proveedor;
        producto.Sucursal = req.body.Sucursal;
        producto.Stock = req.body.Stock;
        producto.EstadoStock = req.body.EstadoStock;
        producto.UMedida = req.body.UMedida;
        producto.Faltante = req.body.Faltante;
        producto.Sobrante = req.body.Sobrante;
        producto.PC = req.body.PC;
        producto.PV = req.body.PV;
        producto.Estado = req.body.Estado;
        producto.save(function(err) {
            if (err) { res.send(err) }
            res.json(producto);
        })
    })
})

router.put('/stockproducto/:id', function(req, res) {
    StocksProductos.findById(req.params.id, function(err, stockproducto) {
        stockproducto.Codigo = req.body.Codigo;
        stockproducto.CodigoBarra = req.body.CodigoBarra;
        stockproducto.Producto = req.body.Producto;
        stockproducto.Nombre = req.body.Nombre;
        stockproducto.Proveedor = req.body.Proveedor;
        stockproducto.Sucursal = req.body.Sucursal;
        stockproducto.Stock = req.body.Stock;
        stockproducto.EstadoStock = req.body.EstadoStock;
        stockproducto.UMedida = req.body.UMedida;
        stockproducto.PC = req.body.PC;
        stockproducto.PV = req.body.PV;
        stockproducto.save(function(err) {
            if (err) { res.send(err) }
            res.json(stockproducto);
        })
    })
})
router.put('/stockproducto1/:id', function(req, res) {
    StocksProductos.findById(req.params.id, function(err, producto) {
        producto.EstadoStock = req.body.EstadoStock;
        producto.save(function(err) {
            if (err) { res.send(err) }
            res.json(producto);
        })
    })
})
router.put('/stockproducto2/:id', function(req, res) {
    StocksProductos.findById(req.params.id, function(err, producto) {
        producto.Sucursal = req.body.Sucursal;
        producto.EstadoStock = req.body.EstadoStock;
        producto.save(function(err) {
            if (err) { res.send(err) }
            res.json(producto);
        })
    })
})
router.put('/venta/:id', function(req, res) {
    Ventas.findById(req.params.id, function(err, venta) {
        venta.IdCliente = req.body.IdCliente;
        venta.NombreCliente = req.body.NombreCliente;
        venta.Dni = req.body.Dni;
        venta.RUC = req.body.RUC;
        venta.Telefono = req.body.Telefono;
        venta.Email = req.body.Email;
        venta.IdVendedor = req.body.IdVendedor;
        venta.NombreVendedor = req.body.NombreVendedor;
        venta.NombreSucursal = req.body.NombreSucursal;
        venta.TipoPago = req.body.TipoPago;
        venta.Estado = req.body.Estado;
        venta.Productos = req.body.Productos;
        venta.SubTotal = req.body.SubTotal;
        venta.IGV = req.body.IGV;
        venta.Total = req.body.Total;
        venta.save(function(err) {
            if (err) { res.send(err) }
            res.json(venta);
        })
    })
})
router.put('/transferencia/:id', function(req, res) {
    Transferencias.findById(req.params.id, function(err, transferencia) {
        transferencia.Transferidos = req.body.Transferidos;
        transferencia.Sucursal1 = req.body.Sucursal1;
        transferencia.Suc1Nombre = req.body.Suc1Nombre;
        transferencia.Sucursal2 = req.body.Sucursal2;
        transferencia.Suc2Nombre = req.body.Suc2Nombre;
        transferencia.Cantidad = req.body.Cantidad;
        transferencia.IdEmisor = req.body.IdEmisor;
        transferencia.NombreEmisor = req.body.NombreEmisor;
        transferencia.IdReceptor = req.body.IdReceptor;
        transferencia.NombreReceptor = req.body.NombreReceptor;
        transferencia.save(function(err) {
            if (err) { res.send(err) }
            res.json(transferencia);
        })
    })
})
router.put('/transferencia1/:id', function(req, res) {
    Transferencias.findById(req.params.id, function(err, transferencia) {
        transferencia.fecha2 = req.body.fecha2;
        transferencia.Estado = req.body.Estado;
        transferencia.save(function(err) {
            if (err) { res.send(err) }
            res.json(transferencia);
        })
    })
})
router.put('/transferencia3/:id', function(req, res) {
    Transferencias.findById(req.params.id, function(err, transferencia) {
        transferencia.fecha3 = req.body.fecha3;
        transferencia.Estado = req.body.Estado;
        transferencia.save(function(err) {
            if (err) { res.send(err) }
            res.json(transferencia);
        })
    })
})
router.put('/transferencia2/:id', function(req, res) {
    Transferencias.findById(req.params.id, function(err, transferencia) {
        transferencia.Transferidos = req.body.Transferidos;
        transferencia.Estado = req.body.Estado;
        transferencia.save(function(err) {
            if (err) { res.send(err) }
            res.json(transferencia);
        })
    })
})
router.put('/acceso/:id', function(req, res) {
        Accesos.findById(req.params.id, function(err, acceso) {
            acceso.fecha2 = req.body.fecha2;
            acceso.save(function(err) {
                if (err) { res.send(err) }
                res.json(acceso);
            })
        })
    })
    //DELETE - Eliminar todos
router.delete('/tarea/:id', function(req, res) {
    Tareas.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'La tarea se ha eliminado' });
    })
})

router.delete('/tipo/:id', function(req, res) {
    Tipos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el tipo se ha eliminado' })
    })
})
router.delete('/cliente/:id', function(req, res) {
    Clientes.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el cliente fue eliminado' });
    })
})

router.delete('/proveedor/:id', function(req, res) {
    Proveedores.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el proveeedor fue eliminado' })
    })
})
router.delete('/sucursal/:id', function(req, res) {
    Sucursales.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'la sucursal fue eliminada' })
    })
})
router.delete('/producto/:id', function(req, res) {
    Productos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el producto fue eliminado' });
    })
})
router.delete('/stockproducto/:id', function(req, res) {
    StocksProductos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el stock de producto fue eliminado' });
    })
});
router.delete('/venta/:id', function(req, res) {
    Ventas.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'la venta del producto fue eliminada' });
    })
})
router.delete('/transferencia/:id', function(req, res) {
    Transferencias.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'la transferencia de los productos fue eliminada' });
    })
})




module.exports = router;