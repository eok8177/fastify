"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const data = request.session.get("data");
    if (!data) {
      return reply.redirect(302, "/login");
    }
    return reply.render("index.ejs", { name: "User", data: data });
  });

  fastify.get("/login", async function (request, reply) {
    const token = await reply.generateCsrf()
    return reply.render("login.ejs", {
      data: request.session.get("data"),
      csrfToken: token,
    });
  });

  fastify.post("/login", {onRequest: fastify.csrfProtection}, async function (request, reply) {
    const data = request.body;
    if (data.email && data.password) {
      if (data.email === "admin" && data.password === "admin") {
        request.session.set("data", data);
        return reply.redirect(302, "/");
      }
    }
    return reply.redirect(302, "/login");
  });

  fastify.post("/logout", (request, reply) => {
    request.session.delete();
    return reply.redirect(302, "/login");
  });
};
