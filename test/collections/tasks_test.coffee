TaskCollection = require 'collections/tasks'
describe "Tasks collection", ->
	beforeEach ->
		@tasks = new TaskCollection [
			{"name":"task 1", "complete":false},
			{"name":"task 2", "complete":true},
			{"name":"task 3", "complete":true}
		]

	describe "the test collection", ->
		it "has 3 items", ->
			@tasks.length.should.equal 3

	describe "tasks.done", ->
		it "returns all 'complete' tasks (2/3)", ->
			@tasks.done().length.should.equal 2