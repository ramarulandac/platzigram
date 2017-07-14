/*var yo = require('yo-yo');
var moment = require('moment');
var translate = require('../translate')
*/
import yo from 'yo-yo';
import moment from 'moment';
import translate from '../translate';

if(!window.Intl){  // Safari treatment -- after npm i --save intl
    window.Intl = require('intl');
    require('intl/locale-data/jsonp/en-US.js')
    require('intl/locale-data/jsonp/es.js')


}

var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat');// se asigna a window para que tenga scope global
require('intl-relativeformat/dist/locale-data/en.js');
require('intl-relativeformat/dist/locale-data/es.js');


var rf = new IntlRelativeFormat('en-US');

module.exports = function pictureCard(pic) {
     

  var el;
   function render(picture){

    return yo`<div class="card ${picture.liked ?'liked':''}">
      <div class="card-image">
        <img class="activator" src="${pic.url}" ondblclick=${like.bind(null, null, true)} />
        <i class="fa fa-heart like-heart ${picture.likeheart?'liked':''}"></i>
      </div>
      <div class="card-content">
        <a href="/${pic.user.username}" class="card-title">
          <img src="${pic.user.avatar}" class="avatar"  />
          <span class="username">${pic.user.username}</span>
        </a>
        <small class="right time">${translate.date.format(picture.createdAt)}</small>
        <p> 
          <a class="left" href="#" onclick=${like.bind(null, true, false)}><i class="fa fa-heart-o heart-o" aria-hidden="true"></i></a>
          <a class="left" href="#" onclick=${like.bind(null, false, false )}><i class="fa fa-heart heart" aria-hidden="true"></i></a>
          <span class="left likes">${translate.message('likes',{ likes: picture.likes })}</span>
        </p>
      </div>
    </div>`;  
  }

    function like(liked, dblclick){  
      
      if(dblclick){
         pic.likeheart = pic.liked =  !pic.liked;  
         liked = pic.liked;
      } else {
         pic.liked = liked;
      }
      
      pic.likes+=liked ? 1: -1;

      function doRender(){
        var newEl = render(pic);
        yo.update(el,newEl);
      }
      
      doRender();
      
      setTimeout(function(){
        pic.likeheart=false;
        doRender();
      },500)

      return false;
    }
                  
             
    el = render(pic);
    return el;
      

         
 }

           
      
