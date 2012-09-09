TaskView = require 'views/task_view'
TaskModel = require 'models/task'

describe "TaskView", ->
	beforeEach ->
		# N.B.  avoiding dependency on TaskModel by providing fake object.
		# Methods are stubbed out as necessary
		taskModel = 
			on: -> 
				console.log "Fake 'on'"
			get: -> 
				console.log "Fake 'get'"
			hasChanged: -> 
				console.log "Fake 'hasChanged'"
				
		@stubTaskOn = sinon.stub(taskModel, 'on')
		@taskView = new TaskView model: taskModel
		# @modelPropertiesSpy = sinon.spy @taskView.model, 'get'

	describe "initialize", ->
		it "binds the model's 'change' event to 'render'", ->
			@stubTaskOn.should.have.been.calledWith('change', @taskView.render)

		it "binds the model's 'destroy' event to 'exit'", ->
			@stubTaskOn.should.have.been.calledWith('destroy', @taskView.exit)

	describe "render", ->
		beforeEach ->
			@templateSpy = sinon.stub @taskView, 'template'
		

		it "element is an <li>", ->
			@taskView.$el.is('li').should.be.true

		it "passes the model to the template", ->
			@taskView.render()
			@templateSpy.should.have.been.calledWith @taskView.model

		describe "setting the appropriate css classes", ->
			# Use the JQuery 'hasClass' method to look for css class. Stubbing
			# the Backbone model's 'get' method to fake the task's completion
			# state
			it "Complete tasks have the 'done' css class", ->
				sinon.stub(@taskView.model, 'get', -> return true).withArgs('complete')
				@taskView.render()
				@taskView.$el.hasClass('done').should.be.true

			it "Incomplete tasks don't have the 'done' css class", ->
				sinon.stub(@taskView.model, 'get', -> return false).withArgs('complete')
				@taskView.render()
				@taskView.$el.hasClass('done').should.not.be.true

			it "Adds 'pulse' class when the model's complete state has changed", ->
				sinon.stub(@taskView.model, 'hasChanged', -> return true)
				@taskView.render()
				@taskView.$el.hasClass('pulse').should.be.true



	describe "toggle", ->
		beforeEach ->
			@taskView.model.toggleDone = sinon.stub()
		it "toggles the model's complete state", ->
			@taskView.toggle()
			@taskView.model.toggleDone.should.have.been.calledOnce

		it "is triggered by clicking on the task view", ->
			# trigger the click event on the view's element
			@taskView.$el.trigger('click')
			@taskView.model.toggleDone.should.have.been.calledOnce

	describe "Entrance animation events", ->
		beforeEach ->
			# new tasks added through the browser (as opposed to those loaded
			# in from the local store) have the 'animated' class added to them
			# to provide an entrance anim. Simulate that here by adding the
			# 'animated' class directly.
			@taskView.$el.addClass 'animated'

		it "removes 'animated' class on animation end event", ->
			@taskView.$el.trigger('animationend')
			@taskView.$el.hasClass('animated').should.not.be.trpue

	describe "Exit", ->
		it "has no animated class before exit called", ->
			@taskView.$el.hasClass('animated').should.be.false
		it "Animation classes added", ->
			@taskView.exit()
			@taskView.$el.hasClass('animated').should.be.true

		it "calls view.remove() on animation complete", ->
			sinon.stub @taskView, 'remove' # stub to prevent default remove implementation
			@taskView.exit()
			@taskView.$el.trigger 'animationend'
			@taskView.remove.should.have.been.calledOnce