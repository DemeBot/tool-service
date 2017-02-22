import { Request, Response, NextFunction } from "express";

const debug = require("debug");

import ToolController from "./../controllers/tool.controller";
import ToolInterface from "./../models/tool.interface";

// Middleware for getting and setting tool data
export class ToolService {

    private toolController: ToolController;

    constructor( toolController?: ToolController ) {
        this.toolController = ( typeof toolController !== "undefined" ) ? toolController : new ToolController();
    }

    // get all tools possible
    public get = ( request: Request, response: Response, next: NextFunction ) => {


        // find desired elements in request parameters
        let get_deleted: boolean = request.query.get_deleted;
        let id: number = request.query.id;
        let name: string = request.query.name;

        // query the controller function
        this.toolController
        .get( id, name, get_deleted )
        .then( ( tools: ToolInterface[] ) => {
            if ( tools.length < 1 ) response.status( 404 ).send();
            else {
                response.status( 200 ).send( { tools : tools } );
            }
        } )
        .catch( ( error: Error ) => {
            console.log( error );
            response.status( 500 ).send("Server error");
        } );
    }

    public post = ( request: Request, response: Response, next: NextFunction ) => {
        let name = request.body.name;
        let description = request.body.description;
        let returnedDoc;

        return this.toolController
        .post(
            name,
            description
        )
        .then( ( new_tool: ToolInterface ) => {
            console.log( JSON.stringify( new_tool ) );
            response.status( 201 ).send( new_tool );
        } )
        .catch( ( error: Error ) => {
            console.log( error );
            response.status( 500 ).send("Server error");
        } );

    }

    public delete = ( parameter: Request, response: Response, next: NextFunction ) => {
        let id = parameter.body.id;

        return this.toolController
        .delete( id )
        .then( ( deletedTools: ToolInterface[] ) => {
            console.log( "deleted tool id: " + id );
            if ( deletedTools.length > 0 )response.status( 204 ).send( deletedTools );
            response.status( 404 ).send();
        } )
        .catch( ( error: Error ) => {
            console.log( error );
            response.status( 500 ).send();
        } );
    }

}

export default ToolService;