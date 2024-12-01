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
			res.json(campaign);
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
			const { idCampaign } = req.params;
			
			if (!idCampaign) {
				return res.status(400).json({ error: "idCampaign is required" });
			}

			const customers = await this.campaignUseCase.getCampaignCustomers(idCampaign);			
			res.json(customers);
		} catch (err) {
			console.error(err);
			res.status(400).json({ error: err.message.message });
		}
	}
	async getCustomerCampaigns(req, res) {
		try {
			const {idCustomer } = req.params;
			
			if (!idCustomer) {
				return res.status(400).json({ error: "idCustomer is required" });
			}

			const campaigns = await this.campaignUseCase.getCustomerCampaigns(idCustomer);			
			res.json(campaigns);
		} catch (err) {
			console.error(err);
			res.status(400).json({ error: err.message.message });
		}
	}
}
