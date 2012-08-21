module.exports = 
	$ ->
		console.log "Mocking task service"
		$.mockjax
			url: "/tasks"
			proxy: "mock_data/tasks.json"