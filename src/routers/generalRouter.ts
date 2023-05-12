import { Router } from "express";
import dotenv from 'dotenv'
dotenv.config()
import { generalController } from "controllers/generalController";

export class GeneralRouter {
    router: Router;
    path: string;
    controller: generalController;
  
    constructor(path: string) {
      (this.router = Router()), (this.path = path);
      this.controller = new generalController();
      
    }
  }