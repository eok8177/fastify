"use strict";

const path = require("node:path");
const fs = require("node:fs");
const AutoLoad = require("@fastify/autoload");

// Pass --options via CLI arguments in command to enable these options.
const options = {};

module.exports = async function (fastify, opts) {

  fastify.register(require("@fastify/secure-session"), {
    // generate secret key: npx --yes @fastify/secure-session > secret-key
    key: fs.readFileSync(path.join(__dirname, "secret-key")),
    expiry: 30 * 24 * 60 * 60, // 1 mounth
  });

  fastify.register(require("@fastify/csrf-protection"), {
    sessionPlugin: "@fastify/secure-session",
  });

  fastify.register(require("@fastify/formbody"));

  fastify.register(require("@fastify/view"), {
    engine: {
      ejs: require("ejs"),
    },
    root: path.join(__dirname, "views"), // Points to `./views` relative to the current file
    layout: "layout.ejs", // Sets the layout to use to `./views/layout.ejs` relative to the current file.
    viewExt: "ejs", // Sets the extension for views to `ejs`
    propertyName: "render", // The template can now be rendered via `reply.render()` and `fastify.render()`
  });

  fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "assets"),
    prefix: "/assets/",
  });

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};

module.exports.options = options;
