
# REACT-TRUMP

A digital version or Top-Trumps written in react, which pulls data from wordpress.
This project was bootstrapped with [Create React App](README.react-app.md).

I am hosting this on github pages https://cwilgar.github.io/react-trumps/

This project is coupled with the [wp-trumps](https://github.com/cWilgar/wp-trumps) project which provides the data through the wordpress rest API.

## Local setup + usage

- Clone this repo
- Run yarn install
- If you have a local copy of wordpress you want to work from, copy .env into .env.local and update the URI.
- See [Available Scripts](README.react-app.md#available-scripts) in the react readme to run the build.

## If I had more time I would...

### FRONT END

* Make the game multiplayer ready (<2) at-least in the JS
* Tidy the component structure
* Create a GameContainer class

* Style it properly! (Including for mobile)
    * Integrate sass
    * add some nice transitions/animations
* LAZY LOAD IMAGES

* Handle a draw as per top-trumps instructions

* Write tests
* Use redux or similar
* Make a full Wordpress single page app like [this]http://enterwell.net/starter-wp-api-react-redux/ example

### WORDPRESS

* Work out how to allow editors to create new cards types - e.g. with a different set of categories, and then be able to add new cards of the type. Not sure if this is possible in hindsight.
