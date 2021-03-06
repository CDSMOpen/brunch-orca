Application = require 'application'

$ ->
	
	#NOTE: This is to resolve a conflict where a **Backbone.Model** passed into an eco
	# template will cause a problem because eco tries to use the models own **escape**
	# method if it exists. This is a problem because they work differently.
	# Backbone doesn't use Backbone.Model.escape, it uses _.escape instead so I'm
	# removing it from the prototype.
	delete Backbone.Model::escape
	
	# Mock service end points
	mocks = require "mocks/mock_services"
	
	# initialise the local storage adapter
	
	# Post on automatically cleaning up event bindings
	# http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view/7607853#7607853
	
	# Look at p54 of 'Backbone In Rails' ebook for way automatically track bound events
	
	# Setup global objects under the generic 'App' namespace
	window.App =
		eventAggregator: new support.EventAggregator()
	
	# Kick off the application
	new Application()
