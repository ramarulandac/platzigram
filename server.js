var express = require('express')
var multer  = require('multer')
var ext     = require('file-extension')

//  Middlewares needed to work with passport

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var expressSession = require('express-session')
var passport = require('passport')
var flash = require('connect-flash');

//  -----------------------------------------

var platzigram = require('platzigram-client')
var auth = require('./auth')

//  -----------------------------------------

var aws     = require('aws-sdk')
var multerS3 = require('multer-s3')
var config  = require('./config')

//  -----------------------------------------

var client = platzigram.createClient(config.client)
const PORT = process.env.PORT || 5050

//  S3 credentials
var s3 = new aws.S3 ({
	accessKeyId: config.aws.accessKey,
	secretAccessKey: config.aws.secretKey
})

var storage = multerS3 ({
	s3: s3,
	bucket: 'storageplatzi',
	acl: 'public-read',
	metadata: function (req, file, cb) {
       cb (null, { fieldName: file.fieldname })
	},
	key: function (req, file, cb) {
		cb (null, + Date.now() + '.' + ext (file.originalname))
	}
})

var upload = multer({ storage: storage }).single('picture')

var app = express();

//  ---------------------------------------------
 //  bodyParser.json enables express to parse json http request
 //  to obtain the json object in the request body
app.set(bodyParser.json())
//  bodyParser.urlencoded enables express to obtain form params
app.use(bodyParser.urlencoded({ extended: false }))
//  cookieParser enables express to response by coockie parser
app.use(cookieParser())
// expressSession enables session middleware
app.use(expressSession({
	secret: config.secret,
	resave: false,
	saveUnitialized: false
}))
//  passport initialization

app.use(passport.initialize())
app.use(passport.session())

//  ------------------------------------------------

app.set('view engine', 'pug')

app.use(express.static('public'))

//  Telling express Strategy autentication and seria and deseria methods
passport.use(auth.localStrategy)
passport.use(auth.facebookStrategy)
passport.deserializeUser(auth.deserializeUser)
passport.serializeUser(auth.serializeUser)

//  ---------------------------------------------------

app.get('/',function (req, res) {
  res.render('index', {title:'Platzigram'})
})

app.get('/signup',function (req, res) {
  res.render('index', {title:'Platzigram - Signup'})
})

app.post('/signup', function (req, res) {
  var user = req.body  // thanks body-parser!
	client.saveUser(user, function (err, user) {
		if (err) return res.status(500).send(err.message)

		res.redirect('/signin')
	})
})

//  visual link on screen
app.get('/signin',function (req, res) {
  res.render('index', {title:'Platzigram - Signin'})
})

//  real route to login
app.use(flash())

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/signin',
	failureFlash: true
}))

app.get('/logout', function (req, res) {
	req.logout()
	res.redirect('/')
})

//  Facebook Authentication
//  Form route for facebook auth
app.get('/auth/facebook', passport.authenticate('facebook', { scope:'email' }))
//  route to receive authentication info
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/signin'
}))

//  Ensure Authentication middleware
function ensureAuth (req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}

	res.status(401).send({error: 'No authenticated'})
}

app.get('/whoami', function (req, res) {
	if (req.isAuthenticated()) {
		return res.json(req.user)
	}

	return res.json({ auth: false })
})

app.get('/api/pictures', function (req, res) {

	client.listPictures(function (err, pictures) {
		if (err) {
      console.log(err)
			return res.send([])}

		res.send(pictures)
	})
})

//  route protected by passport
app.post('/api/pictures', ensureAuth, function (req, res) {
	upload(req, res, function (err) {
		if (err) {
			return res.status(500).send( `Error uploading file: ${err.message}`)
		}

		var user = req.user
		var token = req.user.token
	  var username = req.user.username
		var src = req.file.location

		client.savePicture({
			src: src,
			userId: username,
			user: {
				username: username,
				avatar: user.avatar,
				name: user.name
			}
		}, token, function (err, img) {
			if (err) return res.status(500).send(err.message)

			res.send(`File uploaded successfully: ${req.file.operation}`)
		})
	})
})

// para obtener los datos de cierto usuario!
app.get('/api/user/:username', (req, res) => {
	var username = req.params.username
	client.getUser(username, function (err, user) {
		if (err) return res.status(404).send({error: 'user not found'})

		res.send(user)
	})
})

// de último se definen las rutas mas generales como la de username que acepta parámetros, las particulares como signin/signup, home van primero
// ruta perfil de usuario
app.get('/:username', function (req, res) {
	res.render('index', {title:`Platzigram - ${req.params.username}`})

})

// ruta imagen específica
app.get('/:username/:id', function (req, res) {
	res.render('index', {title:`Platzigram - ${req.params.username}`})

})


app.listen(PORT, function (err) {
  if (err) return console.log(`hubo un error ${err}`), process.exit(1)

  console.log(`platzigram escuchando en el puerto ${PORT}`)
})
