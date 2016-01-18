# scss-starter-micro

## Prerequisites
* [node](https://nodejs.org/en/)
* [gulp](http://gulpjs.com/)
* [bower](http://bower.io/)

## Installation
    npm install

## Gulp Tasks

### Initial
    gulp exec
Install bower components and copy main files to src. Components used are:
* [Material Design Icons](https://materialdesignicons.com/)
* [jQuery](https://jquery.com/)
* [breakpoint](http://breakpoint-sass.com/)

### Development
    gulp
Sets up a development server with browserSync and watches for changes in scss/html/js files

### Build
    gulp build
* create app/ directory and copy files for production.
* uglyfy and concat javascript
* replace links to stylesheets and javascript in html files
* minify images
