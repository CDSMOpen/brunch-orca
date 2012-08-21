support = window.support

describe 'support.Application', ->
	
	sut = view = $el = renderedEl = null
	$ = window.$
	
	beforeEach ->
		$el = $ '<div />'
		sinon.stub $el, 'append'
		
		sut = new support.Application $el
		view = new support.View()
		
		sinon.stub(view, 'render').returns view
		view.el = renderedEl = $('<div>Sub View</div>')[0]
	
	describe 'showView()', ->
		
		beforeEach ->
			sut.showView view
		
		it 'should store the view passed in', ->
			
			(sut.currentView is view).should.be.true
		
		it 'should render the view passed in', ->
			
			view.render.should.have.been.called
		
		it 'should append the passed in views el to the Applications $el', ->
			
			$el.append.should.have.been.calledWith renderedEl
		
		it 'should call \'leave()\' on an existing view', ->
			
			sut.currentView = oldView = new support.View()
			sinon.stub oldView
			
			sut.showView view
			
			oldView.leave.should.have.been.called
