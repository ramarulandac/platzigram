var page     = require('page');
var empty    = require('empty-element');
var template = require('./template');
var title    = require('title');
var request  = require('superagent');
var header   = require('../header');
var axios    = require('axios');
var spinner  = require('./spinner');
let regeneratorRuntime =  require('regenerator-runtime');


page('/',header, loadSpinner, asyncLoad, function(ctx,next){
	title('Platzigram');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template(ctx.pictures)); 
})



////////////////////////////////functions to handle the request-- differente types of libraries

function loadPictures(ctx, next){
	request
		.get('/api/pictures') //llamamos al server en esta ruta 
		.end(function(err,res){ //end llama callback que gestionará respuesta
			if(err) return console.log(err);//Error standar en la comunidad

			ctx.pictures = res.body;        //Asignamos res.body (cuerpo de la respuesta) a ctx(contexto), 
			next();                         // y llamamos a la próxima función

		})
	
}

function loadPicturesAxios(ctx, next){
	axios
		.get('/api/pictures') 
		.then(function(res){ 
			ctx.pictures = res.data;
			
			next();                 	
		})
		.catch(function(err){ 
			console.log(err) 
		})		
	
}

function loadPicturesFetch(ctx, next){
	fetch('/api/pictures')
	.then(function(response){
          return response.json();
		  
		  
	})
	.then(function(pictures){
		ctx.pictures = pictures
		next();
	})
    .catch(function(err){
    	  console.log(err);
    })

}

async function asyncLoad(ctx,next){
	try {
		ctx.pictures = await fetch('api/pictures').then(res=>res.json())
		next();	
	} catch(err){
		return console.log(err);
	}


}

function loadSpinner(ctx, next){
	var main = document.getElementById('main-container');
	empty(main).appendChild(spinner()); 
			next();
}

	