class Tasks extends Backbone.Collection
	model : require 'models/task'
	localStorage : new Store("todos") 
	# url   : '/tasks'
	
	done: =>
		@filter (task)->
			task.get "complete"
	
module?.exports = Tasks
