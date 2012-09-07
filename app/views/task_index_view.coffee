taskView = require 'views/task_view'
mediator = Backbone.Mediator

# A view for the Tasks collection
class TaskIndexView extends Backbone.View 
	className : 'taskIndex'
	tagName : 'section'
	template : require 'templates/task_index_template'
		
	initialize: =>
		# fetch tasks from storage
		@collection.fetch()
		# bind to collection events
		@collection.on "add", @addOne
		@collection.on "reset", (collection, response)=>
			console.log "update detected"
			@render()
		
	render: =>
		# render the template
		@$el.html @template
		# loop through collection and create task views for each
		@collection.each (task)=>
			t = new taskView 
				model: task
			@$el.find('ul.tasklist').append t.render().$el
		this
		
	refresh: =>
		console.log "Refreshing task collection"
		@render()
		
	addTask: (name)=>
		# create a new task model on the collection
		@collection.create "name":name
		# publish a "flash" message
		Backbone.Mediator.publish("flash:notice", "Added task \"#{name}\"")

	# triggered when new items are added to the collection
	addOne: (task, collection)=>
		# create a view for the new task
		newTaskView = new taskView
			model: task
		# append the new task view to the list
		@$el.find('ul.tasklist').append(newTaskView.render().$el.addClass("animated flipInX"))
		

	# delete all tasks marked as complete
	clearAll: =>
		completeTasks = @collection.done()
		task.clear() for task in completeTasks
		# publish a flash message
		Backbone.Mediator.publish "flash:notice", "Cleared #{completeTasks.length} tasks"
		# @render()
		
		
module?.exports = TaskIndexView
		