import { CampaignUseCase } from "@usecases/CampaignUseCase";
import { handleError } from "@utils/http";

export class CampaignController {
	constructor(private campaignUseCase: CampaignUseCase) { }

	async getAll(req, res) {
		try {
			const campaigns = await this.campaignUseCase.getAll();
			res.status(201).json(campaigns);			
		} catch (err) {
			handleError(res, err);
		}
	}

	async getCampaignById(req, res) {
		try {
			const campaignId = req.params.Id;
			const campaign = await this.campaignUseCase.getCampaignById(campaignId);			
			res.status(201).json(campaign);
		} catch (err) {
			handleError(res, err);
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
			res.status(201).json({ message: "Customer Association Created" });			
		} catch (err) {			
			handleError(res, err);
		}
	}

	async updateCampaign(req, res) {
		try {
            const { id } = req.params; 
            await this.campaignUseCase.updateCampaign(id, req.body);            
            res.status(201).json({ message: "Campaign updated successfully" });
            
        } catch (err) {
            handleError(res, err.message);
        }
	}

	async getCampaignCustomers(req, res) {
		try {
			const { idCampaign } = req.params;
			
			const customers = await this.campaignUseCase.getCampaignCustomers(idCampaign);
			if (customers) {
				res.status(201).json(customers);
			} else {
				res.status(404).json({ message: 'Customers not found' });
			}			
			res.status(201).json(customers);
		} catch (err) {
			handleError(res, err);
		}
	}
	async getCustomerCampaigns(req, res) {
		try {
			const {idCustomer } = req.params;
			
			const campaigns = await this.campaignUseCase.getCustomerCampaigns(idCustomer);	
			if (campaigns) {
				res.status(201).json(campaigns);
			} else {
				res.status(404).json({ message: 'Campaigns not found' });
			}
		} catch (err) {
			handleError(res, err);
		}
	}
}
