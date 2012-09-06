class Task extends Backbone.Model
	localStorage : new Store("todos") # uses local storage adapter: https://github.com/jeromegn/Backbone.localStorage
	defaults :
		name : 'Get things done'
		complete : false
		
	# Toggle the task state
	toggleDone : =>
		switch @get('complete')
			when false then @set "complete":true
			else @set "complete":false
		console.log "Setting '#{@get 'name'}' to #{ @get 'complete' }"
		@save()

	# Removes the task model from storage
	clear : =>
		console.log "Clearing '#{@get "name" }'"
		@destroy()
		
		
		
module?.exports = Task