class TaskAppView extends Backbone.View
	class: "tasks"
	tagName: "section"

	# Storing required files as local variables
	template: require "templates/task_app_template"
	TaskModel: require "models/task"
	TasksView: require "views/task_index_view"
	FlashMessagesView: require "views/flash_message_view"
	TasksCollection: require "collections/tasks"
	events:
		"keypress #new-todo": "updateOnEnter" # monitors the input field
		"click a.btn:contains(Clear All)": "emptyTrash"
		
	
	initialize: =>
		# Default tasks collection
		taskCollection = new @TasksCollection [
			{"name":"task 1", "complete":"false"},
			{"name":"task 2", "complete":"false"}
		]
		# the tasks collection view
		@tasks= new @TasksView collection: taskCollection
		# view to show flash messages
		@flashMessages = new @FlashMessagesView()
	
	renderIndex: =>
		

	render: =>
		# render the outer template
		@$el.html @template
		# add the flash messages view to the header 
		@$el.find('header.page-header').append @flashMessages.render().$el
		# add the tasks collection view to the todos section
		@$el.find('section.todos').html(@tasks.render().$el)
		this
		
	# on "return" create a new task
	updateOnEnter: (e)=>
		return unless e.keyCode == 13 # on 'return'
		input = $("input#new-todo") # value of the input field
		if input.val()
			@tasks.addTask input.val() # add a task
			input.val('') #  clear the input field
			
	emptyTrash: =>
		@tasks.clearAll()
		
		
		
module?.exports = TaskAppView