class FlashMessageView extends Backbone.View
	className : 'flash'
	tagName : 'section'
	template : require 'templates/flash_message_template'
	message: "Welcome"
	subscriptions: 
		'flash:notice' : 'notice'

	# display a flash notice
	notice: (msg)=>
		console.log "Notice: #{msg}"
		@message = msg
		@render()

	# render the view
	render: =>
		@$el.html @template {"message": @message}
		@clearTransitions() # in case of overlapping transitions, clear everything before we start
		@enterTransition()
		this

	# set classes for an entry transition
	enterTransition: =>
		@$el.show()
		@$el.addClass "animated fadeInRight"
		# bind end of entry transition to start the exit transition
		@$el.one "webkitAnimationEnd animationend", =>
			@exitTransition()

	# set classes for the exit transition
	exitTransition: =>
		@$el.toggleClass 'delayed fadeInRight fadeOutLeft'
		# bind the end of the exit transition to clean up method
		@$el.one "webkitAnimationEnd animationend", =>
			@clearTransitions()

	clearTransitions: =>
		# clear all animation event bindings
		@$el.unbind('webkitAnimationEnd animationend')
		# clear any animated css
		@$el.removeClass 'animated delayed fadeInRight fadeOutLeft'
		# hide the view
		@$el.hide()

module?.exports = FlashMessageView


