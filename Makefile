all: web sass

web:
	@cd web && python -m SimpleHTTPServer

sass:
	@sass --watch web/sass:web/css

.PHONY: web sass all
