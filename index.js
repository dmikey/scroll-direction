'use strict';
const isDOM = require('is-dom');
const isFunction = require('is-function');
const directions = ["UP", "UP/RIGHT", "RIGHT", "DOWN/RIGHT", "DOWN", "DOWN/LEFT", "LEFT", "UP/LEFT", "UP"];
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
    let l = (prevScrollTop - currentScrollTop) * (Math.PI / 180);
    let prevScrollLeftRad = prevScrollLeft * (Math.PI / 180);
    let currentScrollLeftRad = currentScrollLeft * (Math.PI / 180);
    
    // x = cos θb * sin ∆L
    let x = Math.cos(prevScrollLeftRad) *  Math.sin(l);
    
    // y = cos θa * sin θb – sin θa * cos θb * cos ∆L
    let y = (Math.cos(currentScrollLeftRad) * Math.sin(prevScrollLeftRad)) - (Math.sin(currentScrollLeftRad) * Math.cos(prevScrollLeftRad) * Math.cos(l));
    
    // convert back to degrees after finding radians
    let r = Math.atan2(x, y) * (180 / Math.PI);

    // round and snap to 45 degree angles for 8 way detection
    let index = Math.floor(((r - 22.5) % 360) / 45);

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
