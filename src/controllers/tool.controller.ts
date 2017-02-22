const debug = require("debug");

import  * as mysql from "mysql";
import MySQLConnector from "./../connector/mysql.connector";

import ToolInterface from "./../models/tool.interface";

export class ToolController {

    private DB: mysql.IPool;

    constructor( DB?: mysql.IPool ) {
        // instantiate DB by first checking for injected DB and creating one if one wasn't injected
        this.DB = ( DB || new MySQLConnector().pool );
    }

    // Call plant database for all plants
    public get( id?: number, name?: string, getDeleted: boolean = false ): Promise<ToolInterface[]> {

        // Build MySQL query
        let query: string = "SELECT * FROM TOOLS";
        let queryParams: string[] = [];

        if ( !getDeleted ) {
            queryParams.push( "`ended_at` IS NULL" );
        }

        if ( id !== undefined && String( id ) !== "" ) {
            queryParams.push( "`id` = " + mysql.escape( id ) );
        }

        if ( name !== undefined && name !== "" ) {
            queryParams.push( "`name` = " + mysql.escape( name ) );
        }

        if ( queryParams.length > 0 ) {
            query += " WHERE " + queryParams.join( " AND " );
        }

        // Return Promise
        return new Promise( ( resolve, reject ) => {

            console.log( query );
            // Run MySQL Query
            this.DB.query( query, ( error: Error, results: ToolInterface[] ) => {

                // If there is an error, reject the promise with the error.
                if ( error ) {
                    reject( error );
                }

                // Otherwise resolve the promise with the MySQL results
                else {
                    debug( JSON.stringify( results ) );
                    resolve( results );
                }
            } );
        } );
    }

    // adding new plants to the database
    public post (
         _name: string,
         _description: string = ""
         ): Promise<ToolInterface> {

        let doc = {
            name: _name,
            description: _description
        };

        // Build MySQL query
        let query: string = "INSERT INTO `TOOLS` SET ?";

        return new Promise( ( resolve, reject ) => {
            console.log( query );
            this.DB.query( query, doc, ( error: Error, results ) => {
                if ( error ) reject( error );
                else {
                    console.log( "Inserted ID: " + results.insertId );
                    this.get( results.insertId )
                    .then( ( result: ToolInterface[] ) => {
                        resolve( result[0] );
                    } );
                }
            } );
        } );
    }

    public delete (
        _id: number
    ): Promise<ToolInterface[]> {
        // Build MySQL query
        let query: string = "UPDATE `TOOLS` SET `ended_at` = NOW()  WHERE `id` = " + mysql.escape( _id );

        return new Promise( ( resolve, reject ) => {
            console.log( query );

            this.get( _id )
            .then( ( results: ToolInterface[] ) => {
                if ( results.length > 0 )
                this.DB.query( query, ( error, result ) => {
                    if ( error ) reject( error );
                    resolve( results );
                } );
                else resolve( results );
            } )
            .catch( ( error ) => {
                reject( error );
            } );
        } );
    }
}

export default ToolController;