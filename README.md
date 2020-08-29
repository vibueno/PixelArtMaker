# PixelOdrom

## Table of Contents
- [Description](#description)
- [Libraries](#libraries)
- [Programming](#programming)
- [Usage](#usage)
- [Samples](#samples)
- [Improvements](#improvements)
- [Issues](#issues)
- [Tests](#tests)
- [Validations](#validations)

## Description
This project was developed within the frame of the Front End Developer Nanodegree program at Udacity. However, what I ended up developing exceeds greatly the goals of the initial project.

## Live

For a live version of pixelOdrom, visit [GitHub Pages](https://vibueno.github.io/pixelodrom).

## Libraries
* [jQuery](https://jquery.com)
* [jQuery Awesome Cursor](https://jwarby.github.io/jquery-awesome-cursor)
* [jQuery UI](https://jqueryui.com)
* [jQuery Colorpicker](http://bgrins.github.io/spectrum)
* [Font Awesome](https://fontawesome.com)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js)

## Programming
* Fully responsive (starting at 240px Unihertz Jelly Pro, as fas as I know the smallest Smartphone widely available)
* jQuery Event Delegation
* JavaScript Promises

## Usage
* Select the width and height and create a new canvas
* Select a color with the color picker
* Paint pixels by clicking on them. You can also paint more then one pixel in one stroke by dragging the mouse
* You may reset pixel colors by using the erase tool. Dragging function works for erasing too

### Saving canvas
You can save a canvas for working on it later on. In order to do that, click on the save button at the bottom of the canvas.

### Loading a previously saved canvas
You can load a canvas file by clicking on the folder icon in the main toolbar.

### Exporting canvas as an image
You can export a canvas as an image file by clicking on the image button at the bottom of your canvas.

## Samples
In the folder [samples](https://github.com/vibueno/PixelOdrom/tree/master/samples), you can find art made with PixelOdrom

## Improvements
* Selectable brush size
* Replacing colors on canvas (it could be helpful if you have a big surface painted with one color and you decide to change it)

* Create class pixelCanvas
* Add Unit testing

## Issues
* Image download on DuckDuckGo Privacy Browser on mobile does not seem to work correctly
* Sometimes there is a short delay on certain computers when painting pixels, or some pixels dissapear.

## Tests
* Desktop computer + Developer Tools
* Uniherz Jelly Pro

## Validations
* [HTML (W3C)](https://validator.w3.org)
* [CSS (W3C)](https://jigsaw.w3.org/css-validator)
* [JavaScript (JSHint)](https://jshint.com)