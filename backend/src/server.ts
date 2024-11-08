import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import cors from "cors";
import { app } from "./app";



export const server =() =>{

      const server = express();
      const port = 4200;
      
      const corsOptions = {
        origin: "*",
        optionsSuccessStatus: 200,
      };
      
      server.use(bodyParser.urlencoded({ extended: false }));
      server.use(bodyParser.json());
      server.use(cors(corsOptions));

      server.use('/api', app);
      
      server.listen(port, () => {
        console.log(`App listening on port ${port}`);
      });
      
}