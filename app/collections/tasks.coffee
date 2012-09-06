class Tasks extends Backbone.Collection
	model : require 'models/task'
	localStorage : new Store("todos") # uses localStorage adapter

	# return all "complete" tasks
	done: =>
		@filter (task)->
			task.get "complete"

	
module?.exports = Tasks
