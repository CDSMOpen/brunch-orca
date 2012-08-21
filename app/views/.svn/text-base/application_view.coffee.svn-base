ApplicationTemplate = require 'templates/application_template'

class ApplicationView extends support.View
	
	className: 'app-view'
	tagName: 'div'
	template: ApplicationTemplate
	
	events:
		'click .home': 'onHomeClicked'
		'click .view1': 'onView1Clicked'
		'click .view2': 'onView2Clicked'
	
	render: =>
		@$el.html @template @model
		this
	
	onHomeClicked: (e) =>
		e.preventDefault()
		window.App.eventAggregator.trigger 'navigate:home'
	
	onView1Clicked: (e) =>
		e.preventDefault()
		window.App.eventAggregator.trigger 'navigate:view1'
	
	onView2Clicked: (e) =>
		e.preventDefault()
		window.App.eventAggregator.trigger 'navigate:view2'

module?.exports = ApplicationView
