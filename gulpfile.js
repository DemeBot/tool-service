// Imports
const gulp = require( 'gulp' );
const gulpTS = require( 'gulp-typescript' );
const mocha = require( 'gulp-mocha' );
const tslint = require( 'gulp-tslint' );

const ts = require( 'ts-node/register' );

var exec = require( 'child_process' ).exec;
var spawn = require( 'child_process' ).spawn,
    node;
    

// pull in project TypeScript config
const tsProject = gulpTS.createProject( 'tsconfig.json' );

// launch server, killing old instances if any are running
gulp.task( 'server', [ 'transpile', 'apidoc' ], () => {

    // kill any nunning instances
    if ( node ) node.kill()

    // spawn a new process
    node = spawn( 'node', [ '.dist/server.js' ], { stdio: 'inherit' } );

    // watch for any problems
    node.on( 'close', function ( code ) {
        if ( code === 8 ) {
        gulp.log('Error detected, waiting for changes...');
        }
    } );

} );

// linting task
gulp.task( 'tslint', () => {

    // get source
    gulp.src( 'src/**/*.ts' )
    .pipe( tslint( {
        formatter: "verbose"
    } ) )
    .pipe( tslint.report() );

} );

// ts transpile task
gulp.task( 'transpile', () => {

    // load source from ts configs
    const tsResults = tsProject.src()
    .pipe( tsProject() );

    // hand back js destination files
    return tsResults.js.pipe( gulp.dest( '.dist' ) );
} );

// run tests using mocha 
gulp.task( 'test', () => {

    return gulp.src( 'src/**/*.spec.ts', { read: false } )
    .pipe( mocha( {
        compilers: {
            ts:ts-node
        },
        "reporterOptions": {
            "junit_report_name": "Tests",
            "junit_report_path": "report.xml",
            "junit_report_stack": 1
        }
     } ) );

} );

gulp.task( 'apidoc', ( cb ) => {

    exec( 'npm run apidoc' , (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    } );

} );

gulp.task( 'build', [ 'apidoc', 'transpile' ] );

gulp.task( 'watch', [ 'server' ], () => {
    gulp.watch('src/**/*.ts', [ 'server' ]);
} );

gulp.task( 'default', [ 'tslint', 'test', 'server' ] );
