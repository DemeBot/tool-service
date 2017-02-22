import * as http from "http";
import * as debug from "debug";

import app from "./app";

debug( "ts-express:server" );

const port = normalizePort( process.env.SERVER_PORT || 8080 );
let appExpress = new app().express;
appExpress.set( "port", port );

const server = http.createServer( appExpress );
server.listen( port, onListening );
server.on( "error", onError );

function normalizePort( val: number|string ): number|string|boolean {
    let port: number = ( typeof val === "string" ) ? parseInt( val, 10) : val;
    if ( isNaN( port ) ) return val;
    else if ( port >= 0 ) return port;
    else return false;
}

function onError( error: NodeJS.ErrnoException ): void {
    if ( error.syscall !== "listen" ) throw error;

    let bind = ( typeof port === "string" ) ? "Pipe " + port : "Port " + port;
    switch ( error.code ) {

        case "EACCES":
        console.error( `${bind} requires elevated privileges` );
        process.exit( 1 );
        break;

        case "EADDRINUSE":
        console.error( `${bind} is already in use` );
        process.exit( 1 );
        break;

        default:
        throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = ( typeof addr === "string" ) ? `pipe ${addr}` : `port ${addr.port}`;

    console.log( `Listening on ${bind}` );
}