# brunch-orca

**brunch-orca** is a [brunch](http://brunch.io) skeleton that uses [coffeescript](http://coffeescript.org/), [compass](http://compass-style.org/), [eco](https://github.com/sstephenson/eco/), [jquery](http://jquery.com/), [backbone](http://backbonejs.org/), [mocha](http://visionmedia.github.com/mocha/), [sinon](http://sinonjs.org/) and [chai](http://chaijs.com/) with styling by [Twitter Bootstrap](http://twitter.github.com/bootstrap/index.html). Also uses [Animate.css](http://daneden.me/animate/) for simple transitions.

Uses the Backbone.Mediator pattern for event subscription.

## Usage

To create a new project from this skeleton run

	brunch new appname -s git://github.com/CDSMOpen/brunch-orca.git

once installed run

	npm start

and visit `localhost:3333`

Tests are run through the mocha browser test runner, launch a web server from the project root and navigate to `/test/index.html`

## Javascript Library Versions

See package.json

## ToDo

There's a simple ToDo app /#todos to demonstrate some basic features. [Backbone.LocalStorage](https://github.com/jeromegn/Backbone.localStorage) for persistence. (Uses a localstorage polyfill for headless testing - local storage wouldn't be available otherwise) 