taskView = require 'views/TaskView'

class TaskIndexView extends Backbone.View 
	className : 'taskIndex'
	tagName : 'section'
	template : require 'templates/task_index_template'
	events :
		"click a.btn:contains(Refresh)": "refresh"
		
	initialize: =>
		@collection.on "reset", (collection, response)=>
			console.log "update detected"
			@render()
		
	render: =>
		@$el.html @template
		table = @$el.find('table')
		@collection.each (task)=>
			t = new taskView 
				model: task
			table.append t.render().$el
		this
		
	refresh: =>
		console.log "Refreshing task collection"
		@collection.fetch()
		
		
module?.exports = TaskIndexView
		