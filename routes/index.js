const router = require('express').Router();

const routes = [
    require("./kelas.routes"),
    require("./auth.routes"),
]

routes.forEach(route => {
    router.use(route);
});

module.exports = router