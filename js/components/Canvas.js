/**
 * @module Canvas
 */

import {
  CANVAS_MENU_LOAD_INPUT,
  CANVAS_MENU_SAVE_FILENAME,
  CANVAS_MENU_EXPORT_FILENAME,
  BLANK_PIXEL_COLOR,
  CANVAS,
  PIXEL,
  CANVAS_ASPECT_RATIO,
  CANVAS_MIN_PIXEL_SIZE,
  CANVAS_MAX_PIXEL_SIZE,
  CANVAS_MAX_WIDTH_PO,
  CANVAS_PIXEL_PADDING_CORRECTION,
  CANVAS_ROW_HTML,
  CANVAS_COLUMN_HTML,
} from '../constants.js';

import { functions } from '../functions.js';

import { CanvasNoSpace, CanvasInvalidProportions } from './Error.js';

/**
 * @constructor
 * @description Creates a new Canvas object.
 *
 * @property {Object}  DOMNode DOM object related to the canvas.
 * @property {Number}  canvas width.
 * @property {Number}  canvas height.
 * @property {Number}  canvas maximal width in pixels.
 * @property {Number}  canvas maximal height in pixels.
 * @property {Boolean} tells whether the canvas is active.
 */
let Canvas = function(width, height){
  this.DOMNode = $ ( CANVAS );
  this.width = width;
  this.height = height;
  this.maxWidthPx = Math.min(Math.floor(window.mainDivWidthPx/CANVAS_MIN_PIXEL_SIZE), CANVAS_MAX_WIDTH_PO);
  this.maxHeightPx = Math.floor(this.maxWidth*CANVAS_ASPECT_RATIO);
  this.isActive = false;
};

/**
 * @description Prepares the canvas.
 *
 */
Canvas.prototype.setUp = function() {

  let canvasCSSWidth;
  let pixelSize;

  let pixelBorderSize = $ ( PIXEL ).css('border-left-width');
  pixelBorderSize = (typeof myVar === 'undefined')? 0: functions.CSSPixelToNumber(pixelBorderSize);

  const CANVAS_TOTAL_BORDER_SIZE = pixelBorderSize * this.height;
  const CANVAS_MAX_WIDTH_PX = window.mainDivWidthPx-CANVAS_TOTAL_BORDER_SIZE;

  /* Here we calculate the % of the space available that we will use for the canvas,
  so that the pixels have a reasonable size.
  The side effects of not doing so would be:
  A too wide canvas and small amount of pixels results in too large pixels
  A too small canvas a large amount of pixels would result in too small pixels */

  for (let i=100;i>=1;i-=1) {
    canvasCSSWidth = i;
    pixelSize = ((CANVAS_MAX_WIDTH_PX / 100) * i) / this.width;

    if ((((CANVAS_MAX_WIDTH_PX / 100) * i) / this.width)<=CANVAS_MAX_PIXEL_SIZE) {
      break;
    }
  }

  this.DOMNode.css('width', (canvasCSSWidth+'%'));
  this.width = canvasCSSWidth;

  this.pixelSetUp(CANVAS_MAX_WIDTH_PX);

  this.setVisibility(true);

};

/**
 * @description Sets canvas visibility.
 * @param {Boolean} visible Indicates whether the Canvas should be shown or hidden.
 */
Canvas.prototype.setVisibility = function (visible) {
  if (visible){
    this.DOMNode.removeClass('pixel-canvas-hidden');
    this.DOMNode.addClass('pixel-canvas');
    this.isActive = true;
  }
  else
  {
    this.DOMNode.addClass('pixel-canvas-hidden');
    this.DOMNode.removeClass('pixel-canvas');
    this.isActive = false;
  }
};

/**
 * @description Checks if the canvas width/height ratio is allowed.
 * @param  {Number} width  Width of the canvas in pixelOdrom pixels.
 * @param  {Number} height Height of the canvas in pixelOdrom pixels.
 */
Canvas.prototype.validProportions = function(width, height) {

  const PROPORTION = width/height;

  if (PROPORTION>=(CANVAS_ASPECT_RATIO/4) && PROPORTION <=CANVAS_ASPECT_RATIO){
    return true;
  }
  else{
    return false;
  }
};

/**
 * @description Creates the canvas.
 * @param  {Number}  width  Width of the canvas to be created.
 * @param  {Number}  height Height of the canvas to be created.
 */
Canvas.prototype.create = function(width, height){

  return new Promise((resolve) => {

    //Check if the size of the canvas fits the available space
    if (width > this.maxWidth || height >  this.maxHeight){
      throw new CanvasNoSpace ();
    }

    if (!this.validProportions(width, height)) {
      throw new CanvasInvalidProportions ();
    }

    this.delete();

    for (let i=1; i<=height; i++){
      this.DOMNode.append(CANVAS_ROW_HTML);
      let lastRow = $(CANVAS + ' tr').last();

      for (let j=1; j<=width; j++){
        lastRow.append(CANVAS_COLUMN_HTML);
      }
    }

    this.setUp(height, height);

    resolve ('Canvas created');
  });
};

/**
 * @description Wrapper for the create function.
 * @param  {Number}  width  Width of the canvas to be created.
 * @param  {Number}  height Height of the canvas to be created.
 */
Canvas.prototype.createCanvasWrapper = function (width, height) {

  /* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to create the canvas

  We need the delay call, because otherwise the Spin is not shown */

  if (width*height>1000) {
    window.spinner.show().
    then(functions.delay.bind(1000)).
    then(this.create.bind(null, {width, height})).
    then(window.spinner.hide());
  }
  else {
    window.canvas.create(width, height);
  }
};

/**
 * @description Set ups the pixels in the canvas.
 */
Canvas.prototype.pixelSetUp = function() {

  const CANVAS_MAX_WIDTH_PERCENT = (this.maxWidthPx/window.mainDivWidthPx)*100;

  let pixelWidth = CANVAS_MAX_WIDTH_PERCENT/this.width;

  let padding = pixelWidth;
  padding = padding - padding*CANVAS_PIXEL_PADDING_CORRECTION;

  $ ( PIXEL ).width(pixelWidth+'%');
  $ ( PIXEL ).css('padding-bottom', padding+'%');
};

/**
 * @description Deletes the canvas from the DOM.
 */
Canvas.prototype.delete = function() {

  const CANVAS_ROWS = this.DOMNode.find(' tr ');

  CANVAS_ROWS.remove();
  this.setVisibility(false);
};

/**
 * @description Resets all pixels to their initial color.
 */
Canvas.prototype.reset = function() {
  $ ( PIXEL ).css('background-color', BLANK_PIXEL_COLOR);
};

/**
 * @description Loads a canvas.
 * @param  {Object} input File object containing the canvas to be loaded.
 */
Canvas.prototype.load = function (input) {

  return new Promise((resolve, reject) => {
    const FILE = input.files[0];
    let reader = new FileReader();

    reader.readAsText(FILE);

    reader.onload = function() {

      let readerResult = reader.result;
      let canvasToImport= $(readerResult);

      if (!functions.isValidCanvas(canvasToImport)){
        reject('CanvasWrongFormat');
      }
      else
      {
        const CANVAS_WIDTH = canvasToImport.first().find('.pixel').length;
        const CANVAS_HEIGHT = canvasToImport.length;

        if (CANVAS_WIDTH > this.maxWidth || CANVAS_HEIGHT >  this.maxHeight) {
          window.modal.open('canvasLoad', 'yesNo');
        }
        else {
          this.DOMNode.html(reader.result);
        }

        /* This call is needed in order to make the even onchange fires every time,
        even if the users selects the same file again */
        $ ( CANVAS_MENU_LOAD_INPUT ).prop('value', '');

        resolve ('canvas loaded');
      }
    }.bind(this);

    reader.onerror = function() {
      reject('CanvasLoadError');
    };
  });

};

/**
 * @description Saves the canvas to a .*pix file.
 */
Canvas.prototype.save = function() {

  //We need to clone the canvas, so that we don't modify the DOM
  const CANVAS_TO_SAVE = this.DOMNode.clone();

  //removing styles since they should be calculated when loading
  CANVAS_TO_SAVE.find(PIXEL).css('width', '');
  CANVAS_TO_SAVE.find(PIXEL).css('padding-bottom', '');

  const canvasContent = CANVAS_TO_SAVE.html();

  const blob = new Blob([canvasContent], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, CANVAS_MENU_SAVE_FILENAME);
};

/**
 * @description Exports the canvas to an image file.
 *
 * @returns {Object} Promise
 */
Canvas.prototype.export = function() {

  return new Promise((resolve) => {

    /* In order to make it easier for html2canvas,
    we move the pixel table to the left corner of the browser */
    this.DOMNode.addClass('pixel-canvas-export');
    this.DOMNode.removeClass('pixel-canvas');

    html2canvas(this.DOMNode[0],
      {x: this.DOMNode.left,
       y: this.DOMNode.top})
    .then(canvas => {

      //Saves canvas to client
      saveAs(canvas.toDataURL(), CANVAS_MENU_EXPORT_FILENAME);

      //Moving the pixel table back to its original position
      this.DOMNode.removeClass('pixel-canvas-export');
      this.DOMNode.addClass('pixel-canvas');

      resolve ('Exported canvas');
    });
  });
};


/**
 * @description Wrapper for the export function.
 */
Canvas.prototype.exportCanvasWrapper =  function () {

  /* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to export the canvas */

  window.spinner.show().
  then(window.canvas.export()).
  then(window.spinner.hide());
};

export { Canvas };