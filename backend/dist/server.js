import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import cors from "cors";
import { app } from "./app.js";
export var server = function() {
    var server = express();
    var port = 4200;
    var corsOptions = {
        origin: "*",
        optionsSuccessStatus: 200
    };
    server.use(bodyParser.urlencoded({
        extended: false
    }));
    server.use(bodyParser.json());
    server.use(cors(corsOptions));
    server.use('/api', app);
    server.listen(port, function() {
        console.log("App listening on port ".concat(port));
    });
};

//# sourceMappingURL=server.js.map