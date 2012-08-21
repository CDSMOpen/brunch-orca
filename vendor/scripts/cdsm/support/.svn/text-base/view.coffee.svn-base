# This is the base View that should be extended instead of
# Backbone.Voiew.
# 
# Based on Chapter 5 of 'Backbone In Rails'. **CompositeView** is designed to automatically
# manage clean up of it's children and event bindings when it is removed.
# 
# Use **bindTo()** and **unbindFrom()** to add and remove event bindings rather than binding
# directly to the target.
# 
# Use **renderChild()** to add a child view to a parent CompositeView.
# 
# Call the **leave()** method to remove event bindings and call **leave()** on all child
# views.

window.support ?= {}

class support.View extends Backbone.View
	
	initialize: (options) ->
		super options
		
		@children = []
		@bindings = []
	
	# Function to clean up this view, it's event bindings and any subviews that
	# may belong to it.
	leave: (removeFromDOM=true) ->
		@off()
		@remove() if removeFromDOM
		@_leaveChildren()
		@_removeFromParent()
		@unbindAll()
		@dispose()
	
	# Called automatically from the **leave()** method when the view is being removed.
	# Override this for any special cases where a pointer or binding needs to be disposed
	# of when the view is removed.
	dispose: ->
	
	# Method to add an event binding to an object and store the reference so it can be easily
	# cleaned up later. If a view binds to a model, you should **always** use **bindTo()**
	# insted of **model.on()**.
	# 
	# *source* - The object to listen to
	# *event* - The type of event to listen for
	# *callback* - The method to call when the event fires
	bindTo: (source, event, callback) ->
		source.on event, callback, this
		bindings = @bindings
		_.each event.split(' '), (e) ->
			bindings.push
				source: source
				event: e
				callback: callback
	
	# Remove a binding added with **bindTo()**
	# 
	# *source* - The object to stop unbind from
	# *event* - The type of event to remove
	# *callback* - The callback of the binding to remove
	unbindFrom: (source, event, callback) ->
		binding = _.find @bindings, (o, i) -> true if o.event is event and o.callback is callback
		if binding
			@bindings.splice _.indexOf(@bindings, binding), 1
			binding.source.off binding.event, binding.callback
	
	# Method for unbinding all events that the view has added via **bindTo()**. Called from
	# **leave()** to automatically clean up event bindings when a view is removed.
	unbindAll: ->
		_.each @bindings, (binding) -> binding.source.off binding.event, binding.callback
		@bindings = []
	
	# Renders the view passed in and stores it as a child of this view
	# 
	# *view* - The view to render
	renderChild: (view) ->
		view.render()
		@children.push view
		view.parent = this
		view
	
	# Internal method. Calls leave() on each of the children of this view
	_leaveChildren: ->
		_.each @children, (view) ->
			view.leave() if view.leave
	
	# Internal method. Removes this view from it's parent view
	_removeFromParent: -> @parent._removeChild this if @parent
	
	# Internal method. Removes a sub view
	# 
	# *view* - The view to remove
	_removeChild: (view) ->
		i = @children.indexOf view
		if i > -1
			@children.splice i, 1
			delete view.parent
