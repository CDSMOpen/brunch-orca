class Task extends Backbone.Model
	localStorage : new Store("todos") 
	defaults :
		name : 'Get things done'
		complete : false
		
	toggleDone : =>
		switch @get('complete')
			when false then @set "complete":true
			else @set "complete":false
		console.log "Setting '#{@get 'name'}' to #{ @get 'complete' }"
		@save()

	clear : =>
		console.log "Clearing '#{@get "name" }'"
		@destroy()
		
		
		
module?.exports = Task