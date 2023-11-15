all: dev

dev:
	hugo serve --watch=true --disableFastRender -D

clean:
	hugo mod clean

.PHONY: dev clean
