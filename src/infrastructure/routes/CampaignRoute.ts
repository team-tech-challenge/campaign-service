import { Router } from "express";
import { CampaignAdapter } from "@adapters/CampaignAdapter";
import { CampaignUseCase } from "@usecases/CampaignUseCase";
import { CampaignController } from "@controllers/CampaignController";

export const campaignRoute = Router();

const campaignAdapter = new CampaignAdapter();
const campaignUseCase = new CampaignUseCase(campaignAdapter);
const campaignController = new CampaignController(campaignUseCase);

campaignRoute.get("/all", (req, res) => {
	// #swagger.tags = ['Campaign']
	// #swagger.description = 'Get all campaigns'
	/* #swagger.responses[200] = {
			description: 'Return all campaigns',
			schema: { $ref: '#/definitions/Campaign' }
	} */
	campaignController.getAll(req, res);
});

campaignRoute.get("/:Id", (req, res) => {
	// #swagger.tags = ['Campaign']
	campaignController.getCampaignById(req, res);
});

campaignRoute.post("/create", (req, res) => {
	// #swagger.tags = ['Campaign']
	// #swagger.description = 'Create a new campaign'
	/* #swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: { $ref: '#/definitions/Campaign' }
				}
			}
		}
	*/
	campaignController.createCampaign(req, res);
});

campaignRoute.post("/customer/association/create", (req, res) => {
	// #swagger.tags = ['Campaign']
	// #swagger.description = 'Create a new campaign Customer association'
	/* #swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: { $ref: '#/definitions/AddCampaignCustomer' }
				}
			}
		}
	*/
	campaignController.createCampaignCustomerAssociation(req, res);
});

campaignRoute.put("/update/:id", (req, res) => {
	// #swagger.tags = ['Campaign']
	// #swagger.description = 'Update campaign by ID'
	/* #swagger.requestBody = {
			required: true,
			content: {
				"application/json": {
					schema: { $ref: '#/definitions/Campaign' }
				}
			}
		}
	*/
	campaignController.updateCampaign(req, res);
});

campaignRoute.get("/:id/customers", (req, res) => {
	// #swagger.tags = ['Campaign']
	campaignController.getCampaignCustomers(req, res);
});
