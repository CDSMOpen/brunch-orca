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

window.require.define({"application": function(exports, require, module) {
  var Application, ApplicationModel, ApplicationView, Config, Router, View1, View2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ApplicationModel = require('models/application_model');

  ApplicationView = require('views/application_view');

  Config = require('config');

  Router = require('routers/router');

  View1 = require('views/view1');

  View2 = require('views/view2');

  Application = (function(_super) {

    __extends(Application, _super);

    function Application($el) {
      this.$el = $el;
      this.showView2 = __bind(this.showView2, this);

      this.showView1 = __bind(this.showView1, this);

      this.showDefault = __bind(this.showDefault, this);

      Application.__super__.constructor.call(this, this.$el);
      this.router = new Router();
      App.eventAggregator.on('navigate:home', this.showDefault);
      App.eventAggregator.on('navigate:view1', this.showView1);
      App.eventAggregator.on('navigate:view2', this.showView2);
      this.appModel = new ApplicationModel({
        title: Config.title
      });
      Backbone.history.start();
    }

    Application.prototype.showDefault = function() {
      this.showView(new ApplicationView({
        model: this.appModel
      }));
      return this.router.navigate("#view/home");
    };

    Application.prototype.showView1 = function() {
      this.showView(new View1({
        model: this.appModel
      }));
      return this.router.navigate("#view/view1");
    };

    Application.prototype.showView2 = function() {
      this.showView(new View2({
        model: this.appModel
      }));
      return this.router.navigate("#view/view2");
    };

    return Application;

  })(support.Application);

  module.exports = Application;
  
}});

window.require.define({"collections/tasks": function(exports, require, module) {
  var Tasks,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tasks = (function(_super) {

    __extends(Tasks, _super);

    function Tasks() {
      this.done = __bind(this.done, this);
      return Tasks.__super__.constructor.apply(this, arguments);
    }

    Tasks.prototype.model = require('models/task');

    Tasks.prototype.localStorage = new Store("todos");

    Tasks.prototype.done = function() {
      return this.filter(function(task) {
        return task.get("complete");
      });
    };

    return Tasks;

  })(Backbone.Collection);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Tasks;
  }
  
}});

window.require.define({"config": function(exports, require, module) {
  
  module.exports = {
    title: 'brunch-dolphins'
  };
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    var mocks;
    delete Backbone.Model.prototype.escape;
    mocks = require("mocks/mock_services");
    window.App = {
      eventAggregator: new support.EventAggregator()
    };
    return new Application();
  });
  
}});

window.require.define({"mocks/mock_services": function(exports, require, module) {
  
  module.exports = $(function() {
    console.log("Mocking task service");
    return $.mockjax({
      url: "/tasks",
      proxy: "mock_data/tasks.json"
    });
  });
  
}});

window.require.define({"models/application_model": function(exports, require, module) {
  var ApplicationModel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ApplicationModel = (function(_super) {

    __extends(ApplicationModel, _super);

    function ApplicationModel() {
      return ApplicationModel.__super__.constructor.apply(this, arguments);
    }

    ApplicationModel.prototype.defaults = {
      title: 'A default title'
    };

    return ApplicationModel;

  })(Backbone.Model);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = ApplicationModel;
  }
  
}});

window.require.define({"models/task": function(exports, require, module) {
  var Task,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Task = (function(_super) {

    __extends(Task, _super);

    function Task() {
      this.clear = __bind(this.clear, this);

      this.toggleDone = __bind(this.toggleDone, this);
      return Task.__super__.constructor.apply(this, arguments);
    }

    Task.prototype.localStorage = new Store("todos");

    Task.prototype.defaults = {
      name: 'Get things done',
      complete: false
    };

    Task.prototype.toggleDone = function() {
      switch (this.get('complete')) {
        case false:
          this.set({
            "complete": true
          });
          break;
        default:
          this.set({
            "complete": false
          });
      }
      console.log("Setting '" + (this.get('name')) + "' to " + (this.get('complete')));
      return this.save();
    };

    Task.prototype.clear = function() {
      console.log("Clearing '" + (this.get("name")) + "'");
      return this.destroy();
    };

    return Task;

  })(Backbone.Model);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Task;
  }
  
}});

window.require.define({"routers/router": function(exports, require, module) {
  var Config, Router, TaskAppView, TaskIndexView, Tasks,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Config = require('config');

  TaskAppView = require('views/task_app_view');

  TaskIndexView = require('views/task_index_view');

  Tasks = require('collections/tasks');

  Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.module = null;

    Router.prototype.routes = {
      '': 'todoApp',
      'view/     : id': 'page',
      'todos': 'todoApp',
      '*actions': '404'
    };

    Router.prototype["default"] = function(args) {
      return App.eventAggregator.trigger('navigate:home');
    };

    Router.prototype.page = function(id) {
      return App.eventAggregator.trigger("navigate:" + id);
    };

    Router.prototype.todoApp = function() {
      var view;
      console.log("ToDo App View");
      view = new TaskAppView;
      return $('section#main').html(view.render().$el);
    };

    Router.prototype[404] = function() {
      return console.log("404 - not found");
    };

    return Router;

  })(support.Router);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Router;
  }
  
}});

window.require.define({"templates/404": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<h1>404 - not found</h1>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"templates/application_template": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<h1>');
      
        __out.push(__sanitize(this.get('title')));
      
        __out.push('</h1>\n<h2>Home</h2>\n<ul>\n\t<li><a href="#" class="home">Home</a></li>\n\t<li><a href="#" class="view1">View 1</a></li>\n\t<li><a href="#" class="view2">View 2</a></li>\n</ul>\n<p>This is custom content on the Home template</p>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"templates/flash_message_template": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<span class="label label-warning">');
      
        __out.push(__sanitize(this.message));
      
        __out.push('</span>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"templates/task_app_template": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<header class="page-header">\n\t<h1>What a ToDo</h1>\n\t<input id="new-todo" type="text" placeholder="What next?"/>\n</header>\n<section class="todos">Index</section>\n<footer>\n<a class=\'btn btn-small btn-danger\'>Clear All Complete</a>\n</footer>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"templates/task_index_template": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<section class="row"><ul class="tasklist span5"><ul></section>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"templates/task_view_template": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<i class="icon icon-white icon-ok"/> ');
      
        __out.push(__sanitize(this.get("name")));
      
        __out.push(' ');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"templates/view1_template": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<h1>');
      
        __out.push(__sanitize(this.get('title')));
      
        __out.push('</h1>\n<h2>View One</h2>\n<ul>\n\t<li><a href="#" class="home">Home</a></li>\n\t<li><a href="#" class="view1">View 1</a></li>\n\t<li><a href="#" class="view2">View 2</a></li>\n</ul>\n<p>This is custom content on the View1 template</p>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"templates/view2_template": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<h1>');
      
        __out.push(__sanitize(this.get('title')));
      
        __out.push('</h1>\n<h2>View Two</h2>\n<ul>\n\t<li><a href="#" class="home">Home</a></li>\n\t<li><a href="#" class="view1">View 1</a></li>\n\t<li><a href="#" class="view2">View 2</a></li>\n</ul>\n<p>This is custom content on the View2 template</p>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/application_view": function(exports, require, module) {
  var ApplicationTemplate, ApplicationView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ApplicationTemplate = require('templates/application_template');

  ApplicationView = (function(_super) {

    __extends(ApplicationView, _super);

    function ApplicationView() {
      this.onView2Clicked = __bind(this.onView2Clicked, this);

      this.onView1Clicked = __bind(this.onView1Clicked, this);

      this.onHomeClicked = __bind(this.onHomeClicked, this);

      this.render = __bind(this.render, this);
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.className = 'app-view';

    ApplicationView.prototype.tagName = 'div';

    ApplicationView.prototype.template = ApplicationTemplate;

    ApplicationView.prototype.events = {
      'click .home': 'onHomeClicked',
      'click .view1': 'onView1Clicked',
      'click .view2': 'onView2Clicked'
    };

    ApplicationView.prototype.render = function() {
      this.$el.html(this.template(this.model));
      return this;
    };

    ApplicationView.prototype.onHomeClicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:home');
    };

    ApplicationView.prototype.onView1Clicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:view1');
    };

    ApplicationView.prototype.onView2Clicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:view2');
    };

    return ApplicationView;

  })(support.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = ApplicationView;
  }
  
}});

window.require.define({"views/flash_message_view": function(exports, require, module) {
  var FlashMessageView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlashMessageView = (function(_super) {

    __extends(FlashMessageView, _super);

    function FlashMessageView() {
      this.clearTransitions = __bind(this.clearTransitions, this);

      this.exitTransition = __bind(this.exitTransition, this);

      this.enterTransition = __bind(this.enterTransition, this);

      this.render = __bind(this.render, this);

      this.notice = __bind(this.notice, this);
      return FlashMessageView.__super__.constructor.apply(this, arguments);
    }

    FlashMessageView.prototype.className = 'flash';

    FlashMessageView.prototype.tagName = 'section';

    FlashMessageView.prototype.template = require('templates/flash_message_template');

    FlashMessageView.prototype.message = "Welcome";

    FlashMessageView.prototype.subscriptions = {
      'flash:notice': 'notice'
    };

    FlashMessageView.prototype.notice = function(msg) {
      console.log("Notice: " + msg);
      this.message = msg;
      return this.render();
    };

    FlashMessageView.prototype.render = function() {
      this.$el.html(this.template({
        "message": this.message
      }));
      this.clearTransitions();
      this.enterTransition();
      return this;
    };

    FlashMessageView.prototype.enterTransition = function() {
      var _this = this;
      this.$el.show();
      this.$el.addClass("animated fadeInRight");
      return this.$el.one("webkitAnimationEnd animationend", function() {
        return _this.exitTransition();
      });
    };

    FlashMessageView.prototype.exitTransition = function() {
      var _this = this;
      this.$el.toggleClass('delayed fadeInRight fadeOutLeft');
      return this.$el.one("webkitAnimationEnd animationend", function() {
        return _this.clearTransitions();
      });
    };

    FlashMessageView.prototype.clearTransitions = function() {
      this.$el.unbind('webkitAnimationEnd animationend');
      this.$el.removeClass('animated delayed fadeInRight fadeOutLeft');
      return this.$el.hide();
    };

    return FlashMessageView;

  })(Backbone.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = FlashMessageView;
  }
  
}});

window.require.define({"views/task_app_view": function(exports, require, module) {
  var TaskAppView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskAppView = (function(_super) {

    __extends(TaskAppView, _super);

    function TaskAppView() {
      this.emptyTrash = __bind(this.emptyTrash, this);

      this.updateOnEnter = __bind(this.updateOnEnter, this);

      this.render = __bind(this.render, this);

      this.renderIndex = __bind(this.renderIndex, this);

      this.initialize = __bind(this.initialize, this);
      return TaskAppView.__super__.constructor.apply(this, arguments);
    }

    TaskAppView.prototype["class"] = "tasks";

    TaskAppView.prototype.tagName = "section";

    TaskAppView.prototype.template = require("templates/task_app_template");

    TaskAppView.prototype.TaskModel = require("models/task");

    TaskAppView.prototype.TasksView = require("views/task_index_view");

    TaskAppView.prototype.FlashMessagesView = require("views/flash_message_view");

    TaskAppView.prototype.TasksCollection = require("collections/tasks");

    TaskAppView.prototype.events = {
      "keypress #new-todo": "updateOnEnter",
      "click a.btn:contains(Clear All)": "emptyTrash"
    };

    TaskAppView.prototype.initialize = function() {
      var taskCollection;
      taskCollection = new this.TasksCollection([
        {
          "name": "task 1",
          "complete": "false"
        }, {
          "name": "task 2",
          "complete": "false"
        }
      ]);
      this.tasks = new this.TasksView({
        collection: taskCollection
      });
      return this.flashMessages = new this.FlashMessagesView();
    };

    TaskAppView.prototype.renderIndex = function() {};

    TaskAppView.prototype.render = function() {
      this.$el.html(this.template);
      this.$el.find('header.page-header').append(this.flashMessages.render().$el);
      this.$el.find('section.todos').html(this.tasks.render().$el);
      return this;
    };

    TaskAppView.prototype.updateOnEnter = function(e) {
      var input;
      if (e.keyCode !== 13) {
        return;
      }
      input = $("input#new-todo");
      if (input.val()) {
        this.tasks.addTask(input.val());
        return input.val('');
      }
    };

    TaskAppView.prototype.emptyTrash = function() {
      return this.tasks.clearAll();
    };

    return TaskAppView;

  })(Backbone.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = TaskAppView;
  }
  
}});

window.require.define({"views/task_index_view": function(exports, require, module) {
  var TaskIndexView, mediator, taskView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  taskView = require('views/task_view');

  mediator = Backbone.Mediator;

  TaskIndexView = (function(_super) {

    __extends(TaskIndexView, _super);

    function TaskIndexView() {
      this.clearAll = __bind(this.clearAll, this);

      this.addOne = __bind(this.addOne, this);

      this.addTask = __bind(this.addTask, this);

      this.refresh = __bind(this.refresh, this);

      this.render = __bind(this.render, this);

      this.initialize = __bind(this.initialize, this);
      return TaskIndexView.__super__.constructor.apply(this, arguments);
    }

    TaskIndexView.prototype.className = 'taskIndex';

    TaskIndexView.prototype.tagName = 'section';

    TaskIndexView.prototype.template = require('templates/task_index_template');

    TaskIndexView.prototype.initialize = function() {
      var _this = this;
      this.collection.fetch();
      this.collection.on("add", this.addOne);
      return this.collection.on("reset", function(collection, response) {
        console.log("update detected");
        return _this.render();
      });
    };

    TaskIndexView.prototype.render = function() {
      var _this = this;
      this.$el.html(this.template);
      this.collection.each(function(task) {
        var t;
        t = new taskView({
          model: task
        });
        return _this.$el.find('ul.tasklist').append(t.render().$el);
      });
      return this;
    };

    TaskIndexView.prototype.refresh = function() {
      console.log("Refreshing task collection");
      return this.render();
    };

    TaskIndexView.prototype.addTask = function(name) {
      this.collection.create({
        "name": name
      });
      return Backbone.Mediator.publish("flash:notice", "Added task \"" + (task.get('name')) + "\"");
    };

    TaskIndexView.prototype.addOne = function(task, collection) {
      var newTaskView;
      newTaskView = new taskView({
        model: task
      });
      return this.$el.find('ul.tasklist').append(newTaskView.render().$el.addClass("animated flipInX"));
    };

    TaskIndexView.prototype.clearAll = function() {
      var completeTasks, task, _i, _len;
      completeTasks = this.collection.done();
      for (_i = 0, _len = completeTasks.length; _i < _len; _i++) {
        task = completeTasks[_i];
        task.clear();
      }
      return Backbone.Mediator.publish("flash:notice", "Cleared " + completeTasks.length + " tasks");
    };

    return TaskIndexView;

  })(Backbone.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = TaskIndexView;
  }
  
}});

window.require.define({"views/task_view": function(exports, require, module) {
  var TaskView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskView = (function(_super) {

    __extends(TaskView, _super);

    function TaskView() {
      this.setClasses = __bind(this.setClasses, this);

      this.clearTransitions = __bind(this.clearTransitions, this);

      this.exit_anim_complete = __bind(this.exit_anim_complete, this);

      this.exit = __bind(this.exit, this);

      this.pulse = __bind(this.pulse, this);

      this.toggle = __bind(this.toggle, this);

      this.render = __bind(this.render, this);

      this.initialize = __bind(this.initialize, this);
      return TaskView.__super__.constructor.apply(this, arguments);
    }

    TaskView.prototype.className = "task label label-success";

    TaskView.prototype.tagName = "li";

    TaskView.prototype.template = require("templates/task_view_template");

    TaskView.prototype.events = {
      "click": "toggle",
      "webkitAnimationEnd": "clearTransitions",
      "animationend": "clearTransitions"
    };

    TaskView.prototype.initialize = function() {
      this.model.on("change", this.render);
      return this.model.on("destroy", this.exit);
    };

    TaskView.prototype.render = function() {
      this.$el.html(this.template(this.model));
      console.log("rendering");
      this.setClasses();
      if (this.model.hasChanged("complete")) {
        this.pulse();
      }
      return this;
    };

    TaskView.prototype.toggle = function() {
      return this.model.toggleDone();
    };

    TaskView.prototype.pulse = function() {
      this.$el.removeClass("pulse");
      return this.$el.addClass("animated pulse");
    };

    TaskView.prototype.exit = function() {
      console.log("Removing view");
      this.delegateEvents({
        "webkitAnimationEnd": "exit_anim_complete",
        "animationend": "exit_anim_complete"
      });
      return this.$el.addClass("animated fadeOutLeft");
    };

    TaskView.prototype.exit_anim_complete = function(event) {
      return this.remove();
    };

    TaskView.prototype.clearTransitions = function(event) {
      console.log("removing transition classes");
      return this.$el.removeClass("animated flipInX pulse");
    };

    TaskView.prototype.setClasses = function() {
      if (this.model.get('complete') === true) {
        this.$el.addClass('done label-danger');
        return this.$el.removeClass('label-success');
      } else {
        this.$el.removeClass('done label-danger');
        return this.$el.addClass('label-success');
      }
    };

    return TaskView;

  })(Backbone.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = TaskView;
  }
  
}});

window.require.define({"views/view1": function(exports, require, module) {
  var ApplicationView, View1Template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View1Template = require('templates/view1_template');

  ApplicationView = (function(_super) {

    __extends(ApplicationView, _super);

    function ApplicationView() {
      this.onView2Clicked = __bind(this.onView2Clicked, this);

      this.onView1Clicked = __bind(this.onView1Clicked, this);

      this.onHomeClicked = __bind(this.onHomeClicked, this);

      this.render = __bind(this.render, this);
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.className = 'viewOne';

    ApplicationView.prototype.tagName = 'div';

    ApplicationView.prototype.template = View1Template;

    ApplicationView.prototype.events = {
      'click .home': 'onHomeClicked',
      'click .view1': 'onView1Clicked',
      'click .view2': 'onView2Clicked'
    };

    ApplicationView.prototype.render = function() {
      this.$el.html(this.template(this.model));
      return this;
    };

    ApplicationView.prototype.onHomeClicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:home');
    };

    ApplicationView.prototype.onView1Clicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:view1');
    };

    ApplicationView.prototype.onView2Clicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:view2');
    };

    return ApplicationView;

  })(support.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = ApplicationView;
  }
  
}});

window.require.define({"views/view2": function(exports, require, module) {
  var ApplicationView, View2Template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View2Template = require('templates/view2_template');

  ApplicationView = (function(_super) {

    __extends(ApplicationView, _super);

    function ApplicationView() {
      this.onView2Clicked = __bind(this.onView2Clicked, this);

      this.onView1Clicked = __bind(this.onView1Clicked, this);

      this.onHomeClicked = __bind(this.onHomeClicked, this);

      this.render = __bind(this.render, this);
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.className = 'viewTwo';

    ApplicationView.prototype.tagName = 'div';

    ApplicationView.prototype.template = View2Template;

    ApplicationView.prototype.events = {
      'click .home': 'onHomeClicked',
      'click .view1': 'onView1Clicked',
      'click .view2': 'onView2Clicked'
    };

    ApplicationView.prototype.render = function() {
      this.$el.html(this.template(this.model));
      return this;
    };

    ApplicationView.prototype.onHomeClicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:home');
    };

    ApplicationView.prototype.onView1Clicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:view1');
    };

    ApplicationView.prototype.onView2Clicked = function(e) {
      e.preventDefault();
      return window.App.eventAggregator.trigger('navigate:view2');
    };

    return ApplicationView;

  })(support.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = ApplicationView;
  }
  
}});

