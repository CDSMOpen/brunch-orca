exports.config =
	# See http://brunch.readthedocs.org/en/latest/config.html for documentation.
	files:
		javascripts:
			defaultExtension: 'coffee'
			joinTo:
				'javascripts/app.js': /^app(\/|\\)(?!libs)/
				'javascripts/vendor.js': /^vendor.+scripts/
				'test/javascripts/test.js': /^test(\/|\\)(?!vendor)/
				'test/javascripts/test-vendor.js': /^test(\/|\\)(?=vendor)/
			order:
				before:
					[
						'vendor/scripts/jquery-1.8.0.min.js'
						'vendor/scripts/underscore-1.3.3.js'
						'vendor/scripts/backbone-0.9.2.js'
						'vendor/scripts/backbone-mediator.js'
						'vendor/scripts/jquery.mockjax.js'
						'app/mocks/mock_services.js'
						
						# 'vendor/scripts/cdsm/support/model.coffee'
						# 'vendor/scripts/cdsm/support/composite_view.coffee'
					]
		
		stylesheets:
			joinTo:
				'css/style.css': /^app\/styles/
				'css/bootstrapper.css': /^vendor.+styles.+(bootstrap\.less|responsive\.less)$/
				'test/css/test.css': /^test/
			order:
				before:
					[
						'vendor/styles/bootstrap/bootstrap.less'
					]
		
		templates:
			defaultExtension: 'eco'
			joinTo: 'javascripts/app.js'
	
	framework: 'backbone'
	
	# minify: true
	# 
	server:
		port: 3333
