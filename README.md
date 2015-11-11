# scss-starter-micro

## Prerequisites
* [node](https://nodejs.org/en/)
* [gulp](http://gulpjs.com/)

## Installation
    npm install

## Gulp Tasks

### Development
    gulp
Sets up a development server with browserSync and watches for changes in scss/html/js files

### Build
    gulp build
* create app/ directory and copy files for production.
* uglyfy and concat javascript
* replace links to stylesheets and javascript in html files
* minify images
