import { CampaignUseCase } from "@usecases/CampaignUseCase";
import { defaultReturnStatement, formatObjectResponse, handleError } from "@utils/http";

export class CampaignController {
	constructor(private campaignUseCase: CampaignUseCase) { }

	async getAll(req, res) {
		try {
			const campaigns = await this.campaignUseCase.getAll();
			defaultReturnStatement(res, "Campaigns", campaigns);
		} catch (err) {
			console.error(err);
			res.status(400).json({ error: err.message });
		}
	}

	async getCampaignById(req, res) {
		try {
			const campaignId = req.params.Id;
			const campaign = await this.campaignUseCase.getCampaignById(campaignId);
			defaultReturnStatement(res, "Campaign", campaign);
		} catch (err) {
			console.error(err);
			res.status(400).json({ error: err.message });
		}
	}

	async createCampaign(req, res) {
		try {            
            
            const campaign = await this.campaignUseCase.createCampaign(req.body);
            res.status(201).json(campaign);
        } catch (err) {
            handleError(res, err);
        }		
	}

	async createCampaignCustomerAssociation(req, res) {
		try {
			await this.campaignUseCase.createCampaignCustomerAssociation({ ...req.body });
			res.status(200).json({ message: "Customer Association Created" });			
		} catch (err) {			
			res.status(400).json({ error: err.message });
		}
	}

	async updateCampaign(req, res) {
		try {
            const { id } = req.params; 
            await this.campaignUseCase.updateCampaign(id, req.body);            
            res.status(200).json({ message: "Campaign updated successfully" });
            
        } catch (err) {
            handleError(res, err.message);
        }
	}

	async getCampaignCustomers(req, res) {
		try {
			const campaignId = req.params.id;
			const customers = await this.campaignUseCase.getCampaignCustomers(campaignId);			
			res.json(customers);
		} catch (err) {
			console.error(err);
			res.status(400).json({ error: err.message.message });
		}
	}
}
