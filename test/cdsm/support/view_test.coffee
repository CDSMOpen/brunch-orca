Backbone = window.Backbone
support = window.support

describe 'support.View', ->
	
	sut = view = null
	
	beforeEach ->
		sut = new support.View()
		view = new Backbone.View()
	
	describe 'leave()', ->
		
		beforeEach ->
			sinon.stub sut, 'off'
			sinon.stub sut, 'remove'
			sinon.stub sut, '_leaveChildren'
			sinon.stub sut, '_removeFromParent'
			sinon.stub sut, 'dispose'
			sinon.stub sut, 'unbindAll'
		
		it 'should call \'off()\' to remove event bindings', ->
			
			sut.leave()
			
			sut.off.should.have.been.called
		
		it 'should call \'_leaveChildren()\' to remove any child views', ->
			
			sut.leave()
			
			sut._leaveChildren.should.have.been.called
		
		it 'should call \'_removeFromParent()\' to remove itself from any parent views', ->
			
			sut.leave()
			
			sut._removeFromParent.should.have.been.called
		
		it 'should call \'unbindAll()\' to remove any model bindings', ->
			
			sut.leave()
			
			sut.unbindAll.should.have.been.called
		
		it 'should call \'dispose()\' to do any custom clean up', ->
			
			sut.leave()
			
			sut._removeFromParent.should.have.been.called
		
		describe 'when \'removeFromDOM\' is false', ->
			
			it 'should not call \'remove()\'', ->
				
				sut.leave false
				
				sut.remove.should.not.have.been.called
		
		describe 'when \'removeFromDOM\' is true', ->
			
			it 'should call \'remove()\'', ->
				
				sut.leave true
				
				sut.remove.should.have.been.called
		
		describe 'when \'removeFromDOM\' is not set', ->
			
			it 'should call \'remove()\'', ->
				
				sut.leave()
				
				sut.remove.should.have.been.called
	
	describe 'renderChild()', ->
		
		beforeEach ->
			sinon.stub view, 'render'
			
			sut.renderChild view
		
		it 'should render the view passed in', ->
			
			view.render.should.have.been.called	
		
		it 'should add the view as a child', ->
			
			sut.children.indexOf(view).should.be.above -1
		
		it 'should set the views parent to itself', ->
			
			(view.parent is sut).should.be.true
		
		it 'should return the view passed in', ->
			
			(sut.renderChild(view) is view).should.be.true
	
	describe '_leaveChildren()', ->
		
		view1 = view2 = view3 = null
		
		beforeEach ->
			
			view1 = new support.View()
			view2 = new support.View()
			view3 = new support.View()
			
			sinon.stub view1, 'leave'
			sinon.stub view2, 'leave'
			sinon.stub view3, 'leave'
			
			sut.children =
				[
					view1
					view2
					view3
				]
		
		it 'should call \'leave()\' on each child view', ->
			
			sut._leaveChildren()
			
			view1.leave.should.have.been.called
			view2.leave.should.have.been.called
			view3.leave.should.have.been.called
	
	describe '_removeFromParent()', ->
		
		parentView = null
		
		beforeEach ->
			
			parentView = new support.View()
			sut.parent = parentView
			
			sinon.stub parentView, '_removeChild'
		
		it 'should call \'_removeChild()\' on it\'s parent to remove the reference from it\'s parent', ->
			
			sut._removeFromParent()
			
			parentView._removeChild.should.have.been.called
		
		describe 'when parent is null', ->
			
			beforeEach ->
				sut.parent = null
			
			it 'should not throw an error', ->
				
				sut._removeFromParent()
				
				parentView._removeChild.should.not.have.been.called
	
	describe '_removeChild()', ->
		
		view1 = view2 = view3 = null
		
		beforeEach ->
			
			view1 = new support.View()
			view2 = new support.View()
			view3 = new support.View()
			
			view1.parent = sut
			view2.parent = sut
			view3.parent = sut
			
			sut.children =
				[
					view1
					view2
					view3
				]
		
		it 'should remove the reference to the child from the children Array', ->
			
			sut._removeChild view2
			
			sut.children.indexOf(view2).should.equal -1
			
			sut.children.indexOf(view1).should.be.above -1
			sut.children.indexOf(view3).should.be.above -1
		
		it 'should remove the reference to the parent from the child view', ->
			
			sut._removeChild view2
			
			chai.expect(view2.parent).to.be.undefined
		
		describe 'when the view is not a child of this', ->
			
			view4 = otherParent = null
			
			beforeEach ->
				view4 = new support.View()
				view4.parent = otherParent = new support.View()
			
			it 'should not remove the reference to the views actual parent', ->
				
				sut._removeChild view4
				
				(view4.parent is otherParent).should.be.true
				sut.children.length.should.equal 3
	
	describe 'bindTo()', ->
		
		target = func = null
		
		beforeEach ->
			target = new Backbone.Model()
			sinon.stub target
			func = sinon.stub()
		
		it 'should bind the event to the source', ->
			
			sut.bindTo target, 'test:event', func
			
			target.on.should.have.been.calledWith 'test:event', func, sut
		
		it 'should store a reference to the event in the bindings array', ->
			
			sut.bindTo target, 'test:event', func
			
			sut.bindings.length.should.equal 1
			(sut.bindings[0].source is target).should.be.true
			sut.bindings[0].event.should.equal 'test:event'
			sut.bindings[0].callback.should.equal func
		
		describe 'when there is more than one type of event passed in', ->
			
			it 'should do the bind as a single event', ->
				
				sut.bindTo target, 'test:event1 test:event2', func
				
				target.on.should.have.been.calledWith 'test:event1 test:event2', func, sut
			
			it 'should store a binding reference to each one', ->
				
				sut.bindTo target, 'test:event1 test:event2', func
			
				sut.bindings.length.should.equal 2
				
				(sut.bindings[0].source is target).should.be.true
				sut.bindings[0].event.should.equal 'test:event1'
				sut.bindings[0].callback.should.equal func
				
				(sut.bindings[1].source is target).should.be.true
				sut.bindings[1].event.should.equal 'test:event2'
				sut.bindings[1].callback.should.equal func
	
	describe 'unbindFrom()', ->
		
		target = func = null
		
		beforeEach ->
			target = new Backbone.Model()
			sinon.stub target
			func = sinon.stub()
			
			sut.bindings.push
				source: target
				event: 'event:test'
				callback: func
		
		it 'should call \'off()\' on the binding target', ->
			
			sut.unbindFrom target, 'event:test', func
			
			target.off.should.have.been.calledWith 'event:test', func
		
		it 'should remove the binding from the bindings array', ->
		
			sut.unbindFrom target, 'event:test', func
			
			sut.bindings.length.should.equal 0
		
		describe 'when there are two referenced bindings for the same type and function', ->
			
			beforeEach ->
				sut.bindings.push
					source: target
					event: 'event:test'
					callback: func
			
			it 'should remove only one of them', ->
				
				sut.bindings.length.should.equal 2
				
				sut.unbindFrom target, 'event:test', func
				
				sut.bindings.length.should.equal 1
	
	describe 'unbindAll()', ->
		
		target1 = target2 = target3 = func1 = func2 = func3 = null
		
		beforeEach ->
			target1 = new Backbone.Model()
			target2 = new Backbone.Model()
			target3 = new Backbone.Model()
			
			sinon.stub target1
			sinon.stub target2
			sinon.stub target3
			
			func1 = sinon.stub()
			func2 = sinon.stub()
			func3 = sinon.stub()
			
			sut.bindings.push
				source: target1
				event: 'event:1'
				callback: func1
			sut.bindings.push
				source: target2
				event: 'event:2'
				callback: func2
			sut.bindings.push
				source: target3
				event: 'event:3'
				callback: func3
		
		it 'should call \'off()\' for each stored event binding', ->
			
			sut.unbindAll()
			
			target1.off.should.have.been.calledWith 'event:1', func1
			target2.off.should.have.been.calledWith 'event:2', func2
			target3.off.should.have.been.calledWith 'event:3', func3
		
		it 'should remove all stored event binding references', ->
			
			sut.unbindAll()
			
			sut.bindings.length.should.equal 0
