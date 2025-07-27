module ${name}:
	if [ -z "${name}" ]; then \
		echo "Module name is required"; \
		echo "Usage: make module name=module_name"; \
		exit 1; \
	fi
	if [ -d src/modules/${name} ]; then \
		echo "Module ${name} already exists"; \
		exit 1; \
	else \
		echo "Creating module ${name}"; \
	fi
	mkdir -p src/modules/${name}
	touch src/modules/${name}/${name}.controller.ts
	touch src/modules/${name}/${name}.module.ts
	touch src/modules/${name}/${name}.service.ts



.PHONY: module