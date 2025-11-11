const express = require("express");
const app = express().use(express.json());

const accounts = [];
let nextId = 1;

app
  .route("/accounts")
  .get((_, res) => res.json(accounts))
  .post((req, res) => {
    const a = { id: nextId++, ...req.body };
    accounts.push(a);
    res.status(201).json(a);
  });

app
  .route("/accounts/:id")
  .all((req, res, next) => {
    const a = accounts.find((x) => x.id == req.params.id);
    if (!a) return res.sendStatus(404);
    req.a = a;
    next();
  })
  .get((req, res) => res.json(req.a))
  .put((req, res) => res.json(Object.assign(req.a, req.body)))
  .delete((req, res) => {
    accounts.splice(accounts.indexOf(req.a), 1);
    res.sendStatus(204);
  });

module.exports = app;