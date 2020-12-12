function Carousel(containerID, slideID) {
  this.container = document.querySelector(containerID);
  this.slides = this.container.querySelectorAll(slideID);

  this.interval = 2000;
  this.isPlaying = true;

  this.LEFT_ARROW = 'ArrowLeft';
  this.RIGHT_ARROW = 'ArrowRight';
  this.SPACE = 'Space';
}

Carousel.prototype = {

  _initProps() {
    this.currentSlide = 0;
    this.slidesCount = this.slides.length;
    this.intervalID = null;
    this.swipeStartX = null;
    this.swipeEndX = null;
  },

  _initControls() {
    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.nextBtn = this.container.querySelector('#next-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
  },

  _initIndicators() {
    this.indicatorsContainer = this.container.querySelector('#indicators');
    this.indicators = this.container.querySelectorAll('.indicator');
  },

  _initListeners() {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    
    this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
    
    this.container.addEventListener('touchstart', this.swipeStart.bind(this));
    this.container.addEventListener('touchend', this.swipeEnd.bind(this));

    document.addEventListener('keydown', this.presskey.bind(this));
  },

  _gotoSlide(n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.slidesCount) % this.slidesCount;
    this.indicators[this.currentSlide].classList.toggle('active');
    this.slides[this.currentSlide].classList.toggle('active');
  },

  _gotoPrev() {
    this._gotoSlide(this.currentSlide - 1);
  },

  _gotoNext() {
    this._gotoSlide(this.currentSlide + 1);
  },

  _play() {
    if (!this.isPlaying) {
      this.intervalID = setInterval(() => this._gotoNext(), this.interval);
      let pauseIcon = this.pauseBtn.querySelector('i');
      pauseIcon.classList.remove('fa-play-circle');
      pauseIcon.classList.add('fa-pause-circle');
      this.isPlaying = true;
    }
  },

  _pause() {
    if (this.isPlaying) {
      clearInterval(this.intervalID);
      let pauseIcon = this.pauseBtn.querySelector('i');
      pauseIcon.classList.remove('fa-pause-circle');
      pauseIcon.classList.add('fa-play-circle');
      this.isPlaying = false;
    }
  },

  pausePlay() {
    this.isPlaying ? this._pause() : this._play();
  },

  prev() {
    this._pause();
    this._gotoPrev(); 
  },

  next() {
    this._pause();
    this._gotoNext();
  },

  indicate(event) {
    let target = event.target;

    if (target.classList.contains('indicator')) {
      this._pause();
      this._gotoSlide(+target.dataset.slideTo);
    }
  },

  presskey(event) {
    if (event.code === this.LEFT_ARROW) this.prev();
    if (event.code === this.RIGHT_ARROW) this.next();
    if (event.code === this.SPACE) this.pausePlay();
  },

  swipeStart(event) {
    this.swipeStartX = event.changedTouches[0].pageX;
  },

  swipeEnd(event) {
    this.swipeEndX = event.changedTouches[0].pageX;
    this.swipeStartX - this.swipeEndX > 100 && this.next();
    this.swipeStartX - this.swipeEndX < -100 && this.prev();
  },

  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();

    this.intervalID = setInterval(() => this._gotoNext(), this.interval);
  }

};



