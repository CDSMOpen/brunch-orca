taskView = require 'views/TaskView'

class TaskIndexView extends Backbone.View 
	className : 'taskIndex'
	tagName : 'section'
	template : require 'templates/task_index_template'
		
	initialize: =>
		@collection.fetch()
		@collection.on "add", @addOne
		@collection.on "reset", (collection, response)=>
			console.log "update detected"
			@render()
		
	render: =>
		@$el.html @template
		@collection.each (task)=>
			t = new taskView 
				model: task
			@$el.find('ul.tasklist').append t.render().$el
		this
		
	refresh: =>
		console.log "Refreshing task collection"
		@render()
		
	addTask: (name)=>
		@collection.create "name":name
		
	addOne: (task, collection)=>
		newTaskView = new taskView
			model: task
		@$el.find('ul.tasklist').append(newTaskView.render().$el.addClass("animated flipInX"))
		
	clearAll: =>
		completeTasks = @collection.done()
		task.clear() for task in completeTasks
		# @render()
		
		
module?.exports = TaskIndexView
		