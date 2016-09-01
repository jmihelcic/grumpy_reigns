'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by mihelcic on 27. 08. 2016.
 */

console.log('im alive!');

var Card = function () {
  function Card() {
    _classCallCheck(this, Card);

    this.container = document.querySelector('.body__card-container');
    this.card = this.container.querySelector('.playing-card');
    this.name = 'name';
    this.description = 'description';
    this.image = '';

    this.loadingNewCard = false;
    this.dragging = false;
    this.locked = false;
    this.startX = 0;
    this.currentX = 0;

    // Collect position data
    var data = this.container.querySelector('.deck').getBoundingClientRect();
    console.log('data', data, data.left);
    this.cardX = data.left;
    this.cardW = data.width;
    this.allowedDistance = data.width / 2 * 0.7;

    this.update = this.update.bind(this);
    // Init
    this.initEventListeners();
  }

  _createClass(Card, [{
    key: 'load',
    value: function load(name, description, image) {
      this.name = name;
      this.description = description;
      this.image = image;
    }
  }, {
    key: 'initEventListeners',
    value: function initEventListeners() {
      var _this = this;

      this.container.addEventListener('touchstart', function (event) {
        /*
        if (this.dragging || this.locked)
          return
          */

        if (!event.target.classList.contains('playing-card')) return;

        _this.dragging = true;
        _this.locked = true;
        _this.startX = event.touches[0].pageX;
        _this.currentX = event.touches[0].pageX;
        requestAnimationFrame(_this.update);

        //console.log('touchstart')
      });

      this.container.addEventListener('touchmove', function (event) {
        if (!_this.dragging) return;

        _this.currentX = event.touches[0].pageX;
      });

      this.container.addEventListener('touchend', function (event) {
        if (!_this.dragging) return;

        var distance = _this.currentX - _this.startX;
        if (distance > _this.allowedDistance) {
          _this.startX = _this.allowedDistance * 2;
        } else if (distance < -_this.allowedDistance) {
          _this.startX = -_this.allowedDistance * 2;
        }
        _this.dragging = false;
        //console.log('touchend')
      });
    }
  }, {
    key: 'update',
    value: function update() {
      if (!this.dragging) {
        this.currentX -= (this.currentX - this.startX) / 8;
      }

      var X = this.currentX - this.startX;
      var procentage = X * 100 / this.allowedDistance / 100;
      var deg = procentage * 3; // deg
      var Y = Math.abs(procentage * 14); // px
      var opacity = Math.max(2.5 - Math.abs(procentage), 0);
      var transform = 'translate3d(' + X + 'px, ' + Y + 'px, 0) rotate(' + deg + 'deg)';
      this.card.style.transform = transform;
      this.card.style.opacity = opacity;

      //console.log('update', transform)

      var almostThere = Math.abs(this.currentX - this.startX) < 0.1;

      if (!this.dragging) {
        if (almostThere) {
          this.card.style.transform = 'translate3d(0,0,0) rotate(0deg)';
          this.card.style.opacity = 1;
          this.locked = false;
          return;
        }
      }

      requestAnimationFrame(this.update);
    }
  }]);

  return Card;
}();

var card = new Card();

//# sourceMappingURL=main.js.map