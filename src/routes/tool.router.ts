import { Router } from "express";

import ToolService from "./../services/tool.service";

export class ToolRouter {

    router: Router;
    private toolService: ToolService;

    /**
     * Initialize the router
     */
    constructor( toolService?: ToolService ) {

        this.toolService = typeof toolService !== "undefined" ? toolService : new ToolService();

        this.router = Router();
        this.init();

    }

    init() {
        /**
         * @apiDefine ToolRequest
         *
         * @apiParam (Request Parameters) {string} name Name of the tool
         * @apiParam (Request Parameters) {string} description Description of the tool
         */

        /**
         * @apiDefine ToolResponse
         *
         * @apiSuccess (Successful Response) {number} tool.id Database id of the tool
         * @apiSuccess (Successful Response) {string} tool.name Name of the tool
         * @apiSuccess (Successful Response) {string} tool.description Description of the tool
         * @apiSuccess (Successful Response) {Date} tool.ended_at Deleted at time
         * @apiSuccess (Successful Response) {Date} tool.created_at Created at time
         */

        /**
         * @api {get} /api Get all tools
         * @apiName root
         * @apiGroup Tool
         *
         * @apiParam (Request Parameters) {number} [id] Database id of the tool
         * @apiParam (Request Parameters) {string} [name] Name of the tool
         * @apiParam (Request Parameters) {boolean} [get_deleted=false] Get tools even if they're deleted
         * @apiSuccess (Successful Response) {[tool]} tools An array of tools. Each element in the array has the following keys:
         * @apiUse ToolResponse
         */
        this.router.get( "/", this.toolService.get );

        /**
         * @api {post} /api Add a new tool
         * @apiName Add a new tool
         * @apiGroup Tool
         *
         * @apiUse ToolRequest
         * @apiUse ToolResponse
         */
        this.router.post( "/", this.toolService.post );

        /**
         * @api {delete} /api Delete a tool by id
         * @apiName Delete a  tool
         * @apiGroup Tool
         *
         * @apiParam (Request Parameters) {number} id Database id of the tool
         */
        this.router.delete( "/", this.toolService.delete );
    }
}

// Create router and export its Express.Router

export default ToolRouter;