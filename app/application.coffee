# This is the top level application class that controls Thinqi.

ApplicationModel = require 'models/application_model'
ApplicationView = require 'views/application_view'
Config = require 'config'
Router = require 'routers/router'
View1 = require 'views/view1'
View2 = require 'views/view2'

class Application extends support.Application
	
	constructor: (@$el) ->
		super @$el
		
		#NOTE: Everything is ready so kick off the application
		
		# Instantiate the router
		@router = new Router()
		
		# Register for events
		App.eventAggregator.on 'navigate:home', @showDefault
		App.eventAggregator.on 'navigate:view1', @showView1
		App.eventAggregator.on 'navigate:view2', @showView2
		
		# Create the apps top level model
		@appModel = new ApplicationModel
			title: Config.title
		
		# Start the history to rehydrate the app from the url.
		# If there is no url the router will take us to it's default route, in this
		# case the **showDefault()** method below will be called because the router
		# triggers a 'navigate:home' event via **window.App.eventAggregator** which
		# we just bound to.
		Backbone.history.start()
	
	showDefault: =>
		@showView new ApplicationView
			model: @appModel
		@router.navigate "#view/home"
	
	showView1: =>
		@showView new View1
			model: @appModel
		@router.navigate "#view/view1"
	
	showView2: =>
		@showView new View2
			model: @appModel
		@router.navigate "#view/view2"

module.exports = Application
