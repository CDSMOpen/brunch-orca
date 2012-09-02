class TaskAppView extends Backbone.View
	class: "tasks"
	tagName: "section"
	template: require "templates/task_app_template"
	TaskModel: require "models/task"
	TasksView: require "views/task_index_view"
	TasksCollection: require "collections/tasks"
	events:
		"keypress #new-todo": "updateOnEnter"
		"click a.btn:contains(Clear All)": "clearData"
		
	
	initialize: =>
		taskCollection = new @TasksCollection [
			{"name":"task 1", "complete":"false"},
			{"name":"task 2", "complete":"false"}
		]
		@tasks= new @TasksView collection: taskCollection
	
	renderIndex: =>
		@$el.find('section.todos').html(@tasks.render().$el)

	render: =>
		# render the template
		@$el.html @template
		@renderIndex()
		
		this
		
	updateOnEnter: (e)=>
		return unless e.keyCode == 13
		input = $("input#new-todo")
		if input.val()
			@tasks.addTask input.val()
			input.val('')
			
	clearData: =>
		@tasks.clearAll()
		
		
		
module?.exports = TaskAppView