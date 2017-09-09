if(!window.Intl){  // Safari treatment -- after npm i --save intl
    window.Intl = require('intl');
    require('intl/locale-data/jsonp/en-US.js');
    require('intl/locale-data/jsonp/es.js');
}

var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat');// se asigna a window para que tenga scope global
var IntlMessageFormat = require('intl-messageformat')



require('intl-relativeformat/dist/locale-data/en.js');
require('intl-relativeformat/dist/locale-data/es.js');

var es = require('./es');
var en = require('./en-US');



var MESSAGES = {};
MESSAGES.es = es;
MESSAGES['en-US'] = en;

var locale = localStorage.locale || 'es';
/*
Nótación qu explica linea 39 llamado a IntlMessageFormat
var msg1={}
msg1.es = {
  likes:  '{ likes, number } me gusta '
    }
msg1['es']['likes']   
    */

 

module.exports = {
  message: function(text, opts){

    opts = opts || {};
    var msg = new IntlMessageFormat(MESSAGES[locale][text], locale, null);
    return msg.format(opts);
  },
  date: new IntlRelativeFormat(locale)
}


  