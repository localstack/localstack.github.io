LocalStack Website
==================

The website uses [Hugo](https://github.com/gohugoio/hugo) and the [doks theme](https://github.com/h-enk/doks).

## Build and run locally

Make sure you have `npm` and `hugo` (extended - for sass compilation) installed.

### Install dependencies

npm is used to manage the frontend dependencies.

    npm install

### Build the static website

    hugo --gc --minify

And find the results in `public/`

### Run development server

... and to start the server

    npm run server

Or alternatively

    hugo server --watch=true --disableFastRender

and navigate to http://localhost:1313

## Deploy


