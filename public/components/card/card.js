'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by mihelcic on 28. 08. 2016.
 */

var Card = function () {
  function Card() {
    _classCallCheck(this, Card);

    // Elements
    this.container = document.querySelector('.body__card-container');
    this.card = this.container.querySelector('.playing-card');
    this.cardBack = this.container.querySelector('.playing-card-back');
    this.responseYes = this.card.querySelector('.response-yes');
    this.responseNo = this.card.querySelector('.response-no');

    // Texts
    this.cardDescription = document.querySelector('.card-description__text');
    this.cardName = document.querySelector('.card-name__text');

    // Card data
    this.name = 'Grumpy Grumpalot';
    this.description = 'I want your food. And I want it now!';
    this.image = '';

    // Layout data
    this.cardWidth = 250;
    this.cardHeight = 250;
    this.dismissLength = this.cardWidth * 0.4;

    // Animation data
    this.loadingNewCard = false;
    this.dragging = false;
    this.locked = false;
    // Position
    var cardBCR = this.container.querySelector('.deck').getBoundingClientRect();
    this.cardX = cardBCR.left;
    this.cardY = cardBCR.top;
    this.transformX = 0;
    this.transformY = 0;
    // Mouse position
    this.startX = 0;
    this.currentX = 0;
    this.targetX = 0; // Used to determine where the card should go when released

    // Bind methods
    this._descriptionDown = this._descriptionDown.bind(this);
    this.update = this.update.bind(this);
    // Initialize
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
    key: '_descriptionDown',
    value: function _descriptionDown() {
      var _this = this;

      requestAnimationFrame(function () {
        _this.cardDescription.textContent = _this.description;
        _this.cardDescription.style.transition = 'none';
        _this.cardDescription.style.transform = 'translate3d(0,-20px,0)';
        _this.cardDescription.style.opacity = '0';
        requestAnimationFrame(function () {
          _this.cardDescription.style.transition = 'all 0.2s linear';
          _this.cardDescription.style.transform = 'translate3d(0,0,0)';
          _this.cardDescription.style.opacity = '1';
        });
      });

      this.cardDescription.removeEventListener('transitionend', this._descriptionDown);
    }
  }, {
    key: 'initEventListeners',
    value: function initEventListeners() {
      var _this2 = this;

      this.card.addEventListener('animationend', function () {
        _this2.cardBack.style.animation = 'none';
        _this2.card.style.animation = 'none';
        // Show responses after animation
        _this2.responseYes.style.display = 'block';
        _this2.responseNo.style.display = 'block';
      });

      this.container.addEventListener('touchstart', function (event) {
        // Skip if the target is not a draggable card
        if (!event.target.classList.contains('playing-card')) return;

        _this2.startX = event.touches[0].pageX;
        _this2.currentX = event.touches[0].pageX;
        if (!_this2.locked) // Prevent multiple calls
          requestAnimationFrame(_this2.update);
        _this2.dragging = true;
        _this2.locked = true;
      });

      this.container.addEventListener('touchmove', function (event) {
        // Skip if we didn't start dragging on a draggable card
        if (!_this2.dragging) return;
        // Update the current mouse position
        _this2.currentX = event.touches[0].pageX;
      });

      this.container.addEventListener('touchend', function (event) {
        // Skip if we didn't start dragging on a draggable card
        if (!_this2.dragging) return;

        // Set target
        _this2.targetX = 0;
        var distance = _this2.currentX - _this2.startX;
        if (Math.abs(distance) > _this2.dismissLength) {
          _this2.targetX = distance > 0 ? _this2.cardWidth : -_this2.cardWidth;
        }

        _this2.dragging = false;
      });
    }
  }, {
    key: 'update',
    value: function update() {
      // If we are no longer dragging, ease the position od the card
      if (this.dragging) {
        this.transformX = this.currentX - this.startX;
      } else {
        this.transformX += (this.targetX - this.transformX) / 8;
      }

      // Calculate the transform values
      var distance = this.transformX / this.cardWidth;
      var normalizedDistance = Math.abs(this.transformX) / this.cardWidth;
      var ducking = 50 * normalizedDistance;
      var opacity = 1 - Math.pow(normalizedDistance, 3);
      var rotation = 15 * Math.pow(distance, 1);
      var transform = 'translate3d(' + this.transformX + 'px, ' + ducking + 'px, 0) rotate(' + rotation + 'deg)';
      // Response
      var responseDuck = Math.min(-128 + 128 * normalizedDistance * 4, -28);

      this.card.style.transform = transform;
      this.card.style.opacity = opacity;

      if (distance > 0) {
        this.responseNo.style.display = 'none';
        this.responseYes.style.display = 'block';
        this.responseNo.style.transform = 'translate3d(0,-128px,0) rotate(0deg)';
        this.responseYes.style.transform = 'translate3d(0,' + responseDuck + 'px,0) rotate(' + -rotation + 'deg)';
      } else {
        this.responseNo.style.display = 'block';
        this.responseYes.style.display = 'none';
        this.responseNo.style.transform = 'translate3d(0,' + responseDuck + 'px,0) rotate(' + -rotation + 'deg)';
        this.responseYes.style.transform = 'translate3d(0,-128px,0) rotate(0deg)';
      }

      //console.log('update', transform)

      var closeToStart = Math.abs(this.transformX) < 1.0;
      var closeToInvisible = opacity < 0.05;

      if (!this.dragging) {
        // Animation reset + colors
        if (closeToInvisible) {
          // Test changing text
          this.cardDescription.addEventListener('transitionend', this._descriptionDown);
          this.cardDescription.style.transform = 'translate3d(0,20px,0)';
          this.cardDescription.style.opacity = '0';
          // Hide responses during animation
          this.responseYes.style.display = 'none';
          this.responseNo.style.display = 'none';

          var descriptions = ['I want all of your money!', 'Get away from me!', 'I don\'t want hugs!', 'Please, just go away, and leave me be...', 'You like being annoying huh?', '*sigh*'];
          var colors = ['#ff4500', '#00ff50', '#0087ff', '#ff008b'];
          this.card.style.background = colors[Math.floor(Math.random() * colors.length)];
          this.description = descriptions[Math.floor(Math.random() * descriptions.length)];
          if (distance > 0) {
            this.cardBack.style.animation = 'flip-left 0.6s';
            this.card.style.animation = 'flip-back-left 0.6s';
          } else {
            this.cardBack.style.animation = 'flip-right 0.6s';
            this.card.style.animation = 'flip-back-right 0.6s';
          }
        }
        if (closeToStart || closeToInvisible) {
          this.card.style.transform = 'translate3d(0,0,0) rotate(0deg)';
          this.card.style.opacity = 1;
          this.responseNo.style.transform = 'translate3d(0,-128px,0) rotate(0deg)';
          this.responseYes.style.transform = 'translate3d(0,-128px,0) rotate(0deg)';
          this.transformX = 0;
          this.locked = false;
          return;
        }
      }

      requestAnimationFrame(this.update);
    }
  }]);

  return Card;
}();

//# sourceMappingURL=card.js.map