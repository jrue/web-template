Web Template
============

This is a simple web starter project that includes Bootstrap, jQuery, and D3 and various Grunt tasks I developed for a class I teach. This template uses build and watch Grunt tasks to stage and test a website. The build folder will be generated in `dist` and source files in `src`.

## Installation Instructions

**1. Install Node**

To install this template system, you first need to install Node/NPM on your computer. The LTS version is recommended.

[https://nodejs.org/en/](https://nodejs.org/en/)


**2. Clone repository**

Next, clone (or fork) this repository using the Terminal program on your Mac (command line). It is recommended to change your directory using the `cd` command to a location where you want to serve and work on your project. i.e. `cd ~/Desktop` before running the command below.

```
$ git clone https://github.com/jrue/web-template.git
```

**3. Install this template system**

Next, move into the directory you just cloned, and run the command below to install all of the dependencies. This only installs them within this folder. 

```
$ cd web-template

$ npm install
```

Now, you're ready to work on the project. Open the folder in Sublime. 

## Installing Grunt (Optional)

It's easiest to install Grunt globally, so that you can use simple grunt tasks. I've added a couple of scripts in case you wish not to install globally.

```
$ npm install -g grunt-cli
```

**If you don't want to install Grunt globally**, to run the two grunt commands I've setup use `npm run`.

```
$ npm run grunt

$ npm run setup
```

## Setting up the web template for the first time

There are two Grunt commands for running this template. The first is for initial installation and setup, the second is for build/watch combination (so you can see a preview).

```
$ grunt setup
```

You should only really need to run `grunt setup` the first time you install this template. Every other time, you can just run `grunt`. The setup task cleans the build folder (deletes it), downloads local copies of any Google Fonts requested, and builds the `dist` folder from scratch. It then runs the default task. 

**How to cancel out of terminal**

You can always cancel out of the watch task by pressing <kbd>Control</kbd> + <kbd>C</kbd> on your keyboard. This will allow you to quit Terminal and go on to other things.


After initial setup, you can always relaunch the site and continue from where you left off by opening your Terminal, and `cd` into the directory of your project, and running `grunt` by itself. This will launch both the connect/watch tasks as well as create the build folder.

```
$ grunt
```

## YAML data 

This template includes a top-level `data` folder that exists outside the src folder. (For the curious: This was done to differentiate any data files students might use as part of the project itself, like .csv files). 

The data folder houses files that end with the `.yml` file extension, a data language called YAML. It's a simple way to include information that can later be embedded in your website without needing to type a bunch of HTML. The structure of YAML is fairly intuitive. 

```
name: "Jeremy"
title: "Lecturer"
description: "Here is my description"
```

You can also create lists, which you can inject into your template with a special function that will iterate (loop) through the list outputting a tag for each item.

```
file example.yml

links:
  - title: "Title for link 1"
    url: "https://example.com"
  - title: "Title for link 2"
  	url: "https://example.com"
```

Then later in your `src/index.html` (or any other html file in src for that matter), you would put something like:

```
<%= loop(example, '<div> ${title} </div>') %>
```

This would output:

```
<div>Title for link 1</div>
<div>Title for link 2</div>
```

The `loop()` function takes two arguments. The first is a list item. The second is an ES6 style template format that uses ${} to read variables. 


## The Partials Folder

This repo uses template partials that can be embedded in your webpage. The partials are located in `src/partials`. An example partial using SEO metadata has some boilerplate SEO code that you can put in the head of your document. These templates are useful for adding snippets of code for multiple webpages. (Note that inside the `src/partials/_seo.html` even has template tags in it.)

To embed the partial in your .html, use the following template tag:

```
<%= include("partials/_seo.html") %>
```

Inside the include function is a path to the partial you want to embed.

## Deploying to Github Pages

To deploy this website to Github pages, in yoru terminal run:

```
$ npm run deploy
```

This will create a `gh-pages` branch in your reposity and automaticall push the `dist` folder contents. 




