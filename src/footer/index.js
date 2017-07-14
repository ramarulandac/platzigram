var yo = require('yo-yo')
var translate = require('../translate')
/// Se usa bind al llamar a lang (lineas 10 y 11)para que no se ejecute la función tan pronto cargue sino cuando haya un click en el elemento
 
var el = yo` <footer class="site-footer">
  <div class="container">
    <div class="row">
      <div class="col s12 l3 center-align"><a href="#" data-activates="dropdown1" class="dropdown-button btn btn-flat">${translate.message('language')}</a>
        <ul id="dropdown1" class="dropdown-content">
          <li><a href="#" onclick=${lang.bind(null,'es')}>${translate.message('spanish')}</a></li> 
          <li><a href="#" onclick=${lang.bind(null,'en-US')}>${translate.message('english')}</a></li>
        </ul>
      </div>
      <div class="col s12 l3 push-l6 center-align">© 2016 Platzigram</div>
    </div>
  </div>
</footer>`;

function lang(locale){

  localStorage.locale = locale;
  location.reload();
  return false;
 
}

document.body.appendChild(el);    