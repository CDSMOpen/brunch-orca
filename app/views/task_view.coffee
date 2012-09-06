class TaskView extends Backbone.View
	className: "task label label-success"
	tagName: "li"
	template: require "templates/task_view_template"
	events:
		"click": "toggle"
		"webkitAnimationEnd":"clearTransitions"
		"animationend":"clearTransitions"

	initialize: =>
		# bind to model events
		@model.on "change", @render # re-render on changes to the model
		@model.on "destroy", @exit # remove the view when the model is destroyed
	
	render: =>
		# render the template
		@$el.html @template @model
		console.log "rendering"
		# set css class for transitions
		@setClasses()
		# trigger a pulse anim if the task state changes
		@pulse() if @model.hasChanged "complete"
		this
		
	# toggle the task state
	toggle: =>
		@model.toggleDone()


	pulse: =>
		# Trigger "Pulsing" anim
		@$el.removeClass "pulse"
		@$el.addClass "animated pulse"

	# Animate out
	exit: =>
		console.log "Removing view"
		# trigger remove after anim
		@delegateEvents
			"webkitAnimationEnd":"exit_anim_complete"
			"animationend":"exit_anim_complete"
		# add the css exit anim
		@$el.addClass "animated fadeOutLeft"


	exit_anim_complete: (event)=>
		# remove the view
		@remove()

	# clear transition anim classes
	clearTransitions: (event)=>
		console.log "removing transition classes" 
		@$el.removeClass "animated flipInX pulse"

	setClasses: =>
		# set the css classes based on task state
		if @model.get('complete') == true
			@$el.addClass('done label-danger')
			@$el.removeClass 'label-success'
		else
			@$el.removeClass 'done label-danger'
			@$el.addClass 'label-success'
	
module?.exports = TaskView