all: web sass

web:
	@cd web && python -m SimpleHTTPServer

sass:
	@cd web && sass --watch sass:css

.PHONY: web sass all
