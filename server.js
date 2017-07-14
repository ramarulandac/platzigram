var express = require('express');
var multer  = require('multer');
var ext     = require('file-extension');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, + Date.now() + '.' + ext(file.originalname))
  }
})

var upload = multer({ dest: 'uploads/' });
var upload = multer({ storage: storage }).single('picture');

var app = express();

app.set('view engine','pug');

app.use(express.static('public'));

app.get('/',function(req,res){
  res.render('index',{title:'Platzigram'})
})

app.get('/signup',function(req,res){
  res.render('index',{title:'Platzigram - Signup'})
})

app.get('/signin',function(req,res){
  res.render('index',{title:'Platzigram - Signin'})
})

app.get('/api/pictures',function(req,res){

	var pictures = [
					{	user: {
							username:'marulanda',
							avatar:'https://static.platzi.com/media/avatars/renemar_6cf3c981-36e4-40b1-9cf5-71ca5adf95bd.png'
						 }, 
						  url:'office.jpg',
						  likes:0,
						  liked:false,
						  createdAt: new Date().getTime()
					},
					{	user: {
							username:'marulanda',
							avatar:'https://static.platzi.com/media/avatars/renemar_6cf3c981-36e4-40b1-9cf5-71ca5adf95bd.png'
						 }, 
						  url:'office.jpg',
						  likes:1,
						  liked:false,
						  createdAt: new Date().setDate(new Date().getDate()-10)
					}
				   ]

   
     	 setTimeout(function delayLoading(){
     	 	res.send(pictures)
     	 },1500)
    			   
})


app.post('/api/pictures',function(req,res){
	upload(req ,res , function(err){
		if(err){
			return res.send(500,"Error uploading file");
		}
		res.send('File uploaded successfully');
	})
})

// para obtener los datos de cierto usuario!
app.get('/api/user/:username', function(req, res){
	const user = {
		username:'marulanda',
		avatar:'https://static.platzi.com/media/avatars/renemar_6cf3c981-36e4-40b1-9cf5-71ca5adf95bd.png',
		pictures:[
			{
				id:1,
				src:'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e35/19367292_1791144211215780_3262724399496691712_n.jpg',
				likes:5
			},
			{
				id:2,
				src:'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e35/19122467_108485429765915_7999280866863874048_n.jpg',
				likes:3
			},
			{
				id:3,
				src:'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e35/19120891_1558003960938166_6362684295982612480_n.jpg',
				likes:2
			},
			{
				id:4,
				src:'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e35/18809513_172647449936360_2527427630509064192_n.jpg',
				likes:7
			},
			{
				id:5,
				src:'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e35/18809244_254589491612206_9181861147874164736_n.jpg',
				likes:1
			},
			{
				id:6,
				src:'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e35/18879148_1416332875093291_5094219903301320704_n.jpg',
				likes:4
			}
		]
	}

    res.send(user);

})

// General routes defined
// user profile router server definition
app.get('/:username', function(req, res){
	res.render('index', {title:`Platzigram - ${req.params.username}`})

})

// Route specific image
app.get('/:username/:id', function(req, res){
	res.render('index', {title:`Platzigram - ${req.params.username}`})

})


app.listen(3000,function(err){
  if(err) return console.log(`hubo un error ${err}`),process.exit(1);

  console.log(`platzigram escuchando en el puerto 3000`)
})


   	