TaskModel = require 'models/task'
describe "Task", ->

	describe "New instances", ->
		beforeEach ->
			@task = new TaskModel()
		it "should have a default name", ->
			@task.get('name').should.not.be.empty

		it "should be incomplete", ->
			@task.get('complete').should.be.false

	describe "task.toggleDone", ->
		beforeEach ->
			@task = new TaskModel()
		it "should be available", ->
			# @task.toggleDone.should.not.be.undefined

		it "should toggle the 'complete' state between 'true' and 'false'", ->
			# toggle the complete state
			@task.toggleDone()
			@task.get('complete').should.be.true

			# toggle again
			@task.toggleDone()
			@task.get('complete').should.be.false

	describe "task.clear", ->
		it "calls Backbone's destroy method", ->
			taskSpy = sinon.spy @task, 'destroy'
			@task.clear()
			@task.destroy.should.have.been.calledOnce



