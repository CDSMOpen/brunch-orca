Config = require 'config'
TaskAppView = require 'views/task_app_view'
TaskIndexView = require 'views/task_index_view'
Tasks = require 'collections/tasks'

class Router extends support.Router
	
	module: null
	
	routes      : 
		''         : 'todoIndex'
		'view/     : id' : 'page'
		'todos'    : 'todoApp'
		'*actions' : '404'
	
	#TODO: It seems like the router events could be directly bound to the
	# Application methods, ideally the router stays very thin and deligates
	# events to the app. Everything below this point is boilerplate code
	# for redirecting function calls.
	
	default: (args) -> App.eventAggregator.trigger 'navigate:home'
	
	page: (id) -> App.eventAggregator.trigger "navigate:#{id}"
	
	todoApp: ->
		console.log "ToDo App View"
		view = new TaskAppView 
		$('section#main').html(view.render().$el)
	
	todoIndex: -> 
		console.log "Todos here"
		taskCollection = new Tasks [
			{"name":"task 1"}
			{"name":"task 2"}
		]
		view = new TaskIndexView collection: taskCollection 
		$('section#main').html(view.render().$el)
	
	404: -> 
		console.log "404 - not found"
		

module?.exports = Router
