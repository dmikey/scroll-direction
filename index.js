'use strict';
const isDOM = require('is-dom');
const isFunction = require('is-function');
let prevScrollTop = 0;
let prevScrollLeft = 0;

module.exports = (element,cb) => {
  
  if (!(isDOM(element))) {
    throw new Error('Expected a DOM element.');
  }

  if (!(isFunction(cb))) {
    throw new Error('Expected a callback.');
  }

  function getDirection(currentScrollLeft, currentScrollTop, prevScrollLeft, prevScrollTop) {
    
      // l = Yb - Ya
      // convert to radians
      var l = (prevScrollTop - currentScrollTop) * (Math.PI / 180);
      var prevScrollLeftRad = prevScrollLeft * (Math.PI / 180);
      var currentScrollLeftRad = currentScrollLeft * (Math.PI / 180);
      
      // x = cos θb * sin ∆L
      var x = Math.cos(prevScrollLeftRad) *  Math.sin(l);
      
      // y = cos θa * sin θb – sin θa * cos θb * cos ∆L
      var y = (Math.cos(currentScrollLeftRad) * Math.sin(prevScrollLeftRad)) 
      - (Math.sin(currentScrollLeftRad) * Math.cos(prevScrollLeftRad) * Math.cos(l));
      
      var r = Math.atan2(x, y);
      
      // convert back to degrees
      r = r * (180 / Math.PI);
      
      // directional
      var directions = ["UP", "UP/RIGHT", "RIGHT", "DOWN/RIGHT", "DOWN", "DOWN/LEFT", "LEFT", "UP/LEFT", "UP"];

      // round and snap to 45 degree angles for 8 way detection
      var index = Math.floor( ((r - 22.5) % 360) / 45);

      // return scroll direction
      return directions[index + 1];
  };

  element.addEventListener('scroll',() => { 
     let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
     let currentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

     cb(getDirection(currentScrollLeft, currentScrollTop, prevScrollLeft, prevScrollTop));

     prevScrollLeft = currentScrollLeft;
     prevScrollTop = currentScrollTop;
  }, false);
};
