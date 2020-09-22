IMAGE_NAME = calculator
VERSION = latest

build:
	docker build -t $(IMAGE_NAME):$(VERSION) .
run:
	docker run -p 5000:5000 --name calculator --rm $(IMAGE_NAME):$(VERSION)
lint:
	docker run --rm -v $(PWD):/code eeacms/pylint
	