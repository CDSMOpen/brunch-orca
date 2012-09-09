(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"test/cdsm/support/application_test": function(exports, require, module) {
  var support;

  support = window.support;

  describe('support.Application', function() {
    var $, $el, renderedEl, sut, view;
    sut = view = $el = renderedEl = null;
    $ = window.$;
    beforeEach(function() {
      $el = $('<div />');
      sinon.stub($el, 'append');
      sut = new support.Application($el);
      view = new support.View();
      sinon.stub(view, 'render').returns(view);
      return view.el = renderedEl = $('<div>Sub View</div>')[0];
    });
    return describe('showView()', function() {
      beforeEach(function() {
        return sut.showView(view);
      });
      it('should store the view passed in', function() {
        return (sut.currentView === view).should.be["true"];
      });
      it('should render the view passed in', function() {
        return view.render.should.have.been.called;
      });
      it('should append the passed in views el to the Applications $el', function() {
        return $el.append.should.have.been.calledWith(renderedEl);
      });
      return it('should call \'leave()\' on an existing view', function() {
        var oldView;
        sut.currentView = oldView = new support.View();
        sinon.stub(oldView);
        sut.showView(view);
        return oldView.leave.should.have.been.called;
      });
    });
  });
  
}});

window.require.define({"test/cdsm/support/view_test": function(exports, require, module) {
  var Backbone, support;

  Backbone = window.Backbone;

  support = window.support;

  describe('support.View', function() {
    var sut, view;
    sut = view = null;
    beforeEach(function() {
      sut = new support.View();
      return view = new Backbone.View();
    });
    describe('leave()', function() {
      beforeEach(function() {
        sinon.stub(sut, 'off');
        sinon.stub(sut, 'remove');
        sinon.stub(sut, '_leaveChildren');
        sinon.stub(sut, '_removeFromParent');
        sinon.stub(sut, 'dispose');
        return sinon.stub(sut, 'unbindAll');
      });
      it('should call \'off()\' to remove event bindings', function() {
        sut.leave();
        return sut.off.should.have.been.called;
      });
      it('should call \'_leaveChildren()\' to remove any child views', function() {
        sut.leave();
        return sut._leaveChildren.should.have.been.called;
      });
      it('should call \'_removeFromParent()\' to remove itself from any parent views', function() {
        sut.leave();
        return sut._removeFromParent.should.have.been.called;
      });
      it('should call \'unbindAll()\' to remove any model bindings', function() {
        sut.leave();
        return sut.unbindAll.should.have.been.called;
      });
      it('should call \'dispose()\' to do any custom clean up', function() {
        sut.leave();
        return sut._removeFromParent.should.have.been.called;
      });
      describe('when \'removeFromDOM\' is false', function() {
        return it('should not call \'remove()\'', function() {
          sut.leave(false);
          return sut.remove.should.not.have.been.called;
        });
      });
      describe('when \'removeFromDOM\' is true', function() {
        return it('should call \'remove()\'', function() {
          sut.leave(true);
          return sut.remove.should.have.been.called;
        });
      });
      return describe('when \'removeFromDOM\' is not set', function() {
        return it('should call \'remove()\'', function() {
          sut.leave();
          return sut.remove.should.have.been.called;
        });
      });
    });
    describe('renderChild()', function() {
      beforeEach(function() {
        sinon.stub(view, 'render');
        return sut.renderChild(view);
      });
      it('should render the view passed in', function() {
        return view.render.should.have.been.called;
      });
      it('should add the view as a child', function() {
        return sut.children.indexOf(view).should.be.above(-1);
      });
      it('should set the views parent to itself', function() {
        return (view.parent === sut).should.be["true"];
      });
      return it('should return the view passed in', function() {
        return (sut.renderChild(view) === view).should.be["true"];
      });
    });
    describe('_leaveChildren()', function() {
      var view1, view2, view3;
      view1 = view2 = view3 = null;
      beforeEach(function() {
        view1 = new support.View();
        view2 = new support.View();
        view3 = new support.View();
        sinon.stub(view1, 'leave');
        sinon.stub(view2, 'leave');
        sinon.stub(view3, 'leave');
        return sut.children = [view1, view2, view3];
      });
      return it('should call \'leave()\' on each child view', function() {
        sut._leaveChildren();
        view1.leave.should.have.been.called;
        view2.leave.should.have.been.called;
        return view3.leave.should.have.been.called;
      });
    });
    describe('_removeFromParent()', function() {
      var parentView;
      parentView = null;
      beforeEach(function() {
        parentView = new support.View();
        sut.parent = parentView;
        return sinon.stub(parentView, '_removeChild');
      });
      it('should call \'_removeChild()\' on it\'s parent to remove the reference from it\'s parent', function() {
        sut._removeFromParent();
        return parentView._removeChild.should.have.been.called;
      });
      return describe('when parent is null', function() {
        beforeEach(function() {
          return sut.parent = null;
        });
        return it('should not throw an error', function() {
          sut._removeFromParent();
          return parentView._removeChild.should.not.have.been.called;
        });
      });
    });
    describe('_removeChild()', function() {
      var view1, view2, view3;
      view1 = view2 = view3 = null;
      beforeEach(function() {
        view1 = new support.View();
        view2 = new support.View();
        view3 = new support.View();
        view1.parent = sut;
        view2.parent = sut;
        view3.parent = sut;
        return sut.children = [view1, view2, view3];
      });
      it('should remove the reference to the child from the children Array', function() {
        sut._removeChild(view2);
        sut.children.indexOf(view2).should.equal(-1);
        sut.children.indexOf(view1).should.be.above(-1);
        return sut.children.indexOf(view3).should.be.above(-1);
      });
      it('should remove the reference to the parent from the child view', function() {
        sut._removeChild(view2);
        return chai.expect(view2.parent).to.be.undefined;
      });
      return describe('when the view is not a child of this', function() {
        var otherParent, view4;
        view4 = otherParent = null;
        beforeEach(function() {
          view4 = new support.View();
          return view4.parent = otherParent = new support.View();
        });
        return it('should not remove the reference to the views actual parent', function() {
          sut._removeChild(view4);
          (view4.parent === otherParent).should.be["true"];
          return sut.children.length.should.equal(3);
        });
      });
    });
    describe('bindTo()', function() {
      var func, target;
      target = func = null;
      beforeEach(function() {
        target = new Backbone.Model();
        sinon.stub(target);
        return func = sinon.stub();
      });
      it('should bind the event to the source', function() {
        sut.bindTo(target, 'test:event', func);
        return target.on.should.have.been.calledWith('test:event', func, sut);
      });
      it('should store a reference to the event in the bindings array', function() {
        sut.bindTo(target, 'test:event', func);
        sut.bindings.length.should.equal(1);
        (sut.bindings[0].source === target).should.be["true"];
        sut.bindings[0].event.should.equal('test:event');
        return sut.bindings[0].callback.should.equal(func);
      });
      return describe('when there is more than one type of event passed in', function() {
        it('should do the bind as a single event', function() {
          sut.bindTo(target, 'test:event1 test:event2', func);
          return target.on.should.have.been.calledWith('test:event1 test:event2', func, sut);
        });
        return it('should store a binding reference to each one', function() {
          sut.bindTo(target, 'test:event1 test:event2', func);
          sut.bindings.length.should.equal(2);
          (sut.bindings[0].source === target).should.be["true"];
          sut.bindings[0].event.should.equal('test:event1');
          sut.bindings[0].callback.should.equal(func);
          (sut.bindings[1].source === target).should.be["true"];
          sut.bindings[1].event.should.equal('test:event2');
          return sut.bindings[1].callback.should.equal(func);
        });
      });
    });
    describe('unbindFrom()', function() {
      var func, target;
      target = func = null;
      beforeEach(function() {
        target = new Backbone.Model();
        sinon.stub(target);
        func = sinon.stub();
        return sut.bindings.push({
          source: target,
          event: 'event:test',
          callback: func
        });
      });
      it('should call \'off()\' on the binding target', function() {
        sut.unbindFrom(target, 'event:test', func);
        return target.off.should.have.been.calledWith('event:test', func);
      });
      it('should remove the binding from the bindings array', function() {
        sut.unbindFrom(target, 'event:test', func);
        return sut.bindings.length.should.equal(0);
      });
      return describe('when there are two referenced bindings for the same type and function', function() {
        beforeEach(function() {
          return sut.bindings.push({
            source: target,
            event: 'event:test',
            callback: func
          });
        });
        return it('should remove only one of them', function() {
          sut.bindings.length.should.equal(2);
          sut.unbindFrom(target, 'event:test', func);
          return sut.bindings.length.should.equal(1);
        });
      });
    });
    return describe('unbindAll()', function() {
      var func1, func2, func3, target1, target2, target3;
      target1 = target2 = target3 = func1 = func2 = func3 = null;
      beforeEach(function() {
        target1 = new Backbone.Model();
        target2 = new Backbone.Model();
        target3 = new Backbone.Model();
        sinon.stub(target1);
        sinon.stub(target2);
        sinon.stub(target3);
        func1 = sinon.stub();
        func2 = sinon.stub();
        func3 = sinon.stub();
        sut.bindings.push({
          source: target1,
          event: 'event:1',
          callback: func1
        });
        sut.bindings.push({
          source: target2,
          event: 'event:2',
          callback: func2
        });
        return sut.bindings.push({
          source: target3,
          event: 'event:3',
          callback: func3
        });
      });
      it('should call \'off()\' for each stored event binding', function() {
        sut.unbindAll();
        target1.off.should.have.been.calledWith('event:1', func1);
        target2.off.should.have.been.calledWith('event:2', func2);
        return target3.off.should.have.been.calledWith('event:3', func3);
      });
      return it('should remove all stored event binding references', function() {
        sut.unbindAll();
        return sut.bindings.length.should.equal(0);
      });
    });
  });
  
}});

window.require.define({"test/collections/tasks_test": function(exports, require, module) {
  var TaskCollection;

  TaskCollection = require('collections/tasks');

  describe("Tasks collection", function() {
    beforeEach(function() {
      return this.tasks = new TaskCollection([
        {
          "name": "task 1",
          "complete": false
        }, {
          "name": "task 2",
          "complete": true
        }, {
          "name": "task 3",
          "complete": true
        }
      ]);
    });
    describe("the test collection", function() {
      return it("has 3 items", function() {
        return this.tasks.length.should.equal(3);
      });
    });
    return describe("tasks.done", function() {
      return it("returns all 'complete' tasks (2/3)", function() {
        return this.tasks.done().length.should.equal(2);
      });
    });
  });
  
}});

window.require.define({"test/models/task_test": function(exports, require, module) {
  var TaskModel;

  TaskModel = require('models/task');

  describe("Task", function() {
    describe("New instances", function() {
      beforeEach(function() {
        return this.task = new TaskModel();
      });
      it("should have a default name", function() {
        return this.task.get('name').should.not.be.empty;
      });
      return it("should be incomplete", function() {
        return this.task.get('complete').should.be["false"];
      });
    });
    describe("task.toggleDone", function() {
      beforeEach(function() {
        return this.task = new TaskModel();
      });
      it("should be available", function() {});
      return it("should toggle the 'complete' state between 'true' and 'false'", function() {
        this.task.toggleDone();
        this.task.get('complete').should.be["true"];
        this.task.toggleDone();
        return this.task.get('complete').should.be["false"];
      });
    });
    return describe("task.clear", function() {
      return it("calls Backbone's destroy method", function() {
        var taskSpy;
        taskSpy = sinon.spy(this.task, 'destroy');
        this.task.clear();
        return this.task.destroy.should.have.been.calledOnce;
      });
    });
  });
  
}});

window.require.define({"test/test-helpers": function(exports, require, module) {
  
  module.exports = {
    chai: require('chai'),
    expect: require('chai').expect,
    should: require('chai').should(),
    sinon: require('sinon'),
    sinonChai: require('chai').use(require('sinon-chai'))
  };
  
}});

window.require.define({"test/views/task_view_test": function(exports, require, module) {
  var TaskModel, TaskView;

  TaskView = require('views/task_view');

  TaskModel = require('models/task');

  describe("TaskView", function() {
    beforeEach(function() {
      var taskModel;
      taskModel = {
        on: function() {
          return console.log("Fake 'on'");
        },
        get: function() {
          return console.log("Fake 'get'");
        },
        hasChanged: function() {
          return console.log("Fake 'hasChanged'");
        }
      };
      this.stubTaskOn = sinon.stub(taskModel, 'on');
      return this.taskView = new TaskView({
        model: taskModel
      });
    });
    describe("initialize", function() {
      it("binds the model's 'change' event to 'render'", function() {
        return this.stubTaskOn.should.have.been.calledWith('change', this.taskView.render);
      });
      return it("binds the model's 'destroy' event to 'exit'", function() {
        return this.stubTaskOn.should.have.been.calledWith('destroy', this.taskView.exit);
      });
    });
    describe("render", function() {
      beforeEach(function() {
        return this.templateSpy = sinon.stub(this.taskView, 'template');
      });
      it("element is an <li>", function() {
        return this.taskView.$el.is('li').should.be["true"];
      });
      it("passes the model to the template", function() {
        this.taskView.render();
        return this.templateSpy.should.have.been.calledWith(this.taskView.model);
      });
      return describe("setting the appropriate css classes", function() {
        it("Complete tasks have the 'done' css class", function() {
          sinon.stub(this.taskView.model, 'get', function() {
            return true;
          }).withArgs('complete');
          this.taskView.render();
          return this.taskView.$el.hasClass('done').should.be["true"];
        });
        it("Incomplete tasks don't have the 'done' css class", function() {
          sinon.stub(this.taskView.model, 'get', function() {
            return false;
          }).withArgs('complete');
          this.taskView.render();
          return this.taskView.$el.hasClass('done').should.not.be["true"];
        });
        return it("Adds 'pulse' class when the model's complete state has changed", function() {
          sinon.stub(this.taskView.model, 'hasChanged', function() {
            return true;
          });
          this.taskView.render();
          return this.taskView.$el.hasClass('pulse').should.be["true"];
        });
      });
    });
    describe("toggle", function() {
      beforeEach(function() {
        return this.taskView.model.toggleDone = sinon.stub();
      });
      it("toggles the model's complete state", function() {
        this.taskView.toggle();
        return this.taskView.model.toggleDone.should.have.been.calledOnce;
      });
      return it("is triggered by clicking on the task view", function() {
        this.taskView.$el.trigger('click');
        return this.taskView.model.toggleDone.should.have.been.calledOnce;
      });
    });
    describe("Entrance animation events", function() {
      beforeEach(function() {
        return this.taskView.$el.addClass('animated');
      });
      return it("removes 'animated' class on animation end event", function() {
        this.taskView.$el.trigger('animationend');
        return this.taskView.$el.hasClass('animated').should.not.be.trpue;
      });
    });
    return describe("Exit", function() {
      it("has no animated class before exit called", function() {
        return this.taskView.$el.hasClass('animated').should.be["false"];
      });
      it("Animation classes added", function() {
        this.taskView.exit();
        return this.taskView.$el.hasClass('animated').should.be["true"];
      });
      return it("calls view.remove() on animation complete", function() {
        sinon.stub(this.taskView, 'remove');
        this.taskView.exit();
        this.taskView.$el.trigger('animationend');
        return this.taskView.remove.should.have.been.calledOnce;
      });
    });
  });
  
}});

window.require('test/cdsm/support/application_test');
window.require('test/cdsm/support/view_test');
window.require('test/collections/tasks_test');
window.require('test/models/task_test');
window.require('test/views/task_view_test');
