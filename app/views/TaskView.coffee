class TaskView extends Backbone.View
	className: "task label label-success"
	tagName: "li"
	template: require "templates/task_view_template"
	events:
		"click": "toggle"
		
	initialize: =>
		# bind to model events
		@model.on "change", @render
		@model.on "destroy", @exit
	
	render: =>
		@$el.html @template @model
		console.log "rendering"
		@setClasses()
		this
		
	# toggle the task state
	toggle: =>
		@model.toggleDone()
		@setClasses()
		@render

	# Animate out
	exit: =>
		console.log "Removing view"
		# trigger remove after anim
		@delegateEvents
			"webkitAnimationEnd":"exit_anim_complete"
			"animationend":"exit_anim_complete"
		# add the css anim
		@$el.addClass "animated fadeOutLeft"


	exit_anim_complete: (event)=>
		# remove the view
		@remove()

	setClasses: =>
		# set the css classes based on task state
		if @model.get('complete') == true
			@$el.addClass('done label-danger')
			@$el.removeClass 'label-success'
		else
			@$el.removeClass 'done label-danger'
			@$el.addClass 'label-success'
	
module?.exports = TaskView