import { Campaign } from "@entities/Campaign";
import { CampaignCustomer } from "@entities/CampaignCustomer";

export interface ICampaignGateway {
	allCampaigns(): Promise<Campaign[]>;

	getCampaignById(id: number): Promise<Campaign>;

	newCampaign(campaign: Campaign): Promise<Campaign>;

	newCampaignAssociation(values: any): Promise<void>;

	updateCampaign(id: number, campaign: Campaign): Promise<void>;

	getCustomersOfCampaign(campaignId: number, customerId?: number): Promise<{  campaignId: number; customer: any | null }[]>;
	
	getCampaignsOfCustomer(customerId: number): Promise<{  customerId: number; campaign: any | null }[]>;
}
