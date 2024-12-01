import { ICampaignGateway } from "@gateways/ICampaignGateway";
import { Campaign } from "@entities/Campaign";
import { CampaignCustomer } from "@entities/CampaignCustomer";

export class CampaignUseCase {
	constructor(private readonly campaignGateway: ICampaignGateway) { }

	async getAll(): Promise<Campaign[]> {
		return await this.campaignGateway.allCampaigns();
	}

	async getCampaignById(id: number): Promise<Campaign | null> {
		const campaigns = await this.campaignGateway.getCampaignById(id);
		return campaigns ? campaigns : null;
	}

	async createCampaign(data: Campaign): Promise<Campaign> {		
		return await this.campaignGateway.newCampaign(data);
	}

	async createCampaignCustomerAssociation(data: any): Promise<void> {
		const campaign = await this.campaignGateway.getCampaignById(data.campaignId);
		if (!campaign)	throw new Error('Campaign not found');

		const customerCampaign = await this.campaignGateway.getCustomersOfCampaign(data.campaignId, data.customerId);
		
		if (customerCampaign && customerCampaign.length > 0)	throw new Error('Customer already registered in the campaign.');

		await this.campaignGateway.newCampaignAssociation(data);
	}

	async updateCampaign(id: number, data: Campaign): Promise<any> {
		const campaign = await this.getCampaignById(id);
		if (!campaign) throw new Error("Campaign not found");
				
		await this.campaignGateway.updateCampaign(id, data);
	}

	async getCampaignCustomers(campaignId: number): Promise<{  campaignId: number; customer: any | null }[]> { 
		
		const campaignCustomers = await this.campaignGateway.getCustomersOfCampaign(campaignId);

		if (!campaignCustomers) {
			throw new Error('customer not found');
		}
	  
		return campaignCustomers;
	}
	async getCustomerCampaigns(customerId: number ): Promise<{  customerId: number; campaign: any | null }[]> { 
		
		const customerCampaigns = await this.campaignGateway.getCampaignsOfCustomer(customerId);

		if (!customerCampaigns) {
			throw new Error('customer not found');
		}
	  
		return customerCampaigns;
	}
}
