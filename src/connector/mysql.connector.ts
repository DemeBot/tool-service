import * as mysql from "mysql";

/**
 * MySQLConnector
 */
export class MySQLConnector {
    pool: mysql.IPool;
    connection: mysql.IConnection;

    constructor( host?: string, user?: string, password?: string, database?: string ) {
        this.pool = this.createPool( 10 , host, user, password, database );
    }

    private createPool( connectionLimit?: number,  host?: string, user?: string, password?: string, database?: string ): mysql.IPool {
        return mysql.createPool( {
            connectionLimit: ( connectionLimit ),
            host: ( host || process.env.DB_HOST || "localhost" ),
            user: ( user || process.env.DB_USER || "user" ),
            password: ( password || process.env.DB_PASSWORD || "password" ),
            database: ( database || process.env.DB_DATABASE || "test" )
        } );
    }
}

export default MySQLConnector;