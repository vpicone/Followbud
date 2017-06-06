// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {
  var burger = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  burger.addEventListener('click', function() {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });
})();

(function() {
  var buttons = document.querySelectorAll('.button')
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      buttons[i].classList.toggle('is-loading');
    });
  };
})();

window.onpageshow = function(event) {
  if (event.persisted) {
    window.location.reload()
  }
};

window.fbAsyncInit = function() {
  FB.init({
    appId: '216737828833595',
    cookie: true,
    xfbml: true,
    version: 'v2.8'
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
