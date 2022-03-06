var path = require('path');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');


var config = require('./config');

var userSchema = new mongoose.Schema({
    Email: { type: String, unique: true, lowercase: true },
    Password: { type: String, select: false },
    Nombres: String,
    Apellidos: String,
    TipoDocumento: String,
    NroDocumento:String,
    Perfil:String,
    Estado:Number,
    fechaInscripcion: { type: Date, default: Date.now },
    Celular: Number,
    picture: String
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('Password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.Password, salt, function(err, hash) {
            user.Password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.Password, function(err, isMatch) {
        done(err, isMatch);
    });
};

var User = mongoose.model('User', userSchema);
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then (() => {
    console.log ('MongoDB conectado ...')
  })
  .catch (err => console.log (err))
/*mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});*/

//llamada a los models para los microservs

require('./models/Tareas');
require('./models/Tipos');
require('./models/clientes');
require('./models/proveedores');
require('./models/sucursales');
require('./models/productos');
require('./models/stockProducto');
require('./models/transferencias');
require('./models/Ventas');
require('./models/registros');
require('./models/dependencia');
require('./models/persona');
require('./models/tipoparte');
require('./models/actoprocesal');
require('./models/expediente');
require('./models/legajo');
require('./models/expedientelegajo');
require('./models/legajoarchivo');

//llamado a los js que contienen los microservicios

var routes = require('./routes/index');
var dependencias = require('./routes/dependencia');
var personas = require('./routes/persona')
var tipoPartes = require('./routes/tipoparte')
var actoprocesal = require('./routes/actosprocesales')
var expediente = require('./routes/expediente')
var legajo = require('./routes/legajo');
var users = require('./routes/users');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Force HTTPS on Heroku
if (app.get('env') === 'production') {
    app.use(function(req, res, next) {
        var protocol = req.get('x-forwarded-proto');
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}
app.use(express.static(path.join(__dirname, '/public')));

//rutas para realizar llamados de los microservicios
app.use('/', routes);
app.use('/users', users);
app.use('/dep',dependencias);
app.use('/parte',personas);
app.use('/parte', tipoPartes);
app.use('/',actoprocesal);
app.use('/archivo',expediente);
app.use('/archivo',legajo);

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(token, config.TOKEN_SECRET);
    } catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
        sub: user._id,
        nombre:user.nombres,
        apellido:user.apellidos,
        tipo:user.tipo,
        email:user.email,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
app.get('/usuarios', function(req, res, next) {
    User.find(function(err, users) {
        if (err) { return next(err) }
        res.json(users)
    })
})
app.get('/api/me', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
        res.send(user);
    });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
app.put('/api/me', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'Usuario no encontrado' });
        }
        user.nombres = req.body.nombres || user.nombres;
        user.apellidos = req.body.apellidos || user.apellidos;
        user.tipo = req.body.tipo || user.tipo;
        user.picture = req.body.picture || user.picture;
        user.celular = req.body.celular || user.celular;
        user.email = req.body.email || user.email;
        user.save(function(err) {
            res.status(200).end();
        });
    });
});


/*
 |--------------------------------------------------------------------------
 | Log in 
 |--------------------------------------------------------------------------
 */
 app.post('/auth/login', function(req, res) {
    User.findOne({ Email: req.body.email }, '+Password', function(err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Correo electrónico y / o contraseña incorrectos' });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'Correo electrónico y / o contraseña incorrectos' });
            }
            res.send({ token: createJWT(user) });
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/auth/signup', function(req, res) {
    console.log(req.body)
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'el correo electronico ya ha sido tomado' });
        }
        var user = new User({
            Email: req.body.email,
            Password: req.body.password,
            Nombres: req.body.nombres,
            Apellidos: req.body.apellidos,
            TipoDocumento: req.body.tipo,
            NroDocumento:req.body.NroDocumento,
            Perfil:req.body.perfil,
            Estado:req.body.Estado,
            celular: req.body.celular,
        });
        console.log(user)
        user.save(function() {
            res.send({ token: createJWT(user) });
        });
    });
});



/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
    console.log('Express server escuchando en el puerto ' + app.get('port'));
});