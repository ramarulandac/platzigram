require('babel-polyfill') 
var page = require('page');
//var moment = require('moment')//Lenguaje local de las fechas
//require('moment/locale/es');//Lenguaje local de las fechas
//moment.locale('es')//Lenguaje local de las fechas

////Conviene un orden de las rutas de la aplicación
require('./homepage');
require('./signup');
require('./signin');
require('./user-page')
require('./footer');

//Se inicializa page
page();