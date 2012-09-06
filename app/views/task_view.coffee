class TaskView extends Backbone.View
	className: "task label label-success"
	tagName: "li"

	# Define the template function as a property on the view allows for
	# convenient stubbing during testing e.g. mySpy = sinon.stub(taskView,
	# 'template')
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
		#
		# N.B. I don't like switching multiple class values like this: 'done
		# lable- danger'. Feels like I'm creating too much of a dependency to
		# the css layer. I'd rather just manage the 'done' class and handle
		# any styling changes through that single value change. This is a
		# symptom of using Twitter Bootstrap for convenience's sake

		if @model.get('complete') == true
			@$el.addClass('done label-danger')
			@$el.removeClass 'label-success'
		else
			@$el.removeClass 'done label-danger'
			@$el.addClass 'label-success'
	
module?.exports = TaskView