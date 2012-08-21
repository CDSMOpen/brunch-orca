class TaskView extends Backbone.View
	className: "task"
	tagName: "tr"
	template: require "templates/task_view_template"
	
	render: =>
		@$el.html @template @model
		console.log @model.get "name"
		this
	
module?.exports = TaskView