import { Campaign as CampaignModel } from "@database/CampaignModel";
import { CampaignCustomer as CampaignCustomerModel } from "@database/CampaignCustomerModel";
import { ICampaignGateway } from "@gateways/ICampaignGateway";
import { Campaign } from "@entities/Campaign";
import { CampaignCustomer } from "@entities/CampaignCustomer";
import { CampaignMapper } from "@mappers/CampaignMapper";
import { CampaignCustomerMapper } from "@mappers/CampaignCustomerMapper";
import { searchCustomer } from "src/infrastructure/external/database/api/Customer";

export class CampaignAdapter implements ICampaignGateway {
	async allCampaigns(): Promise<Campaign[]> {		
		const campaignModels = await CampaignModel.findAll();
        return campaignModels.map(model => CampaignMapper.toEntity(model));
	}

	async getCampaignById(id: number): Promise<Campaign> {
        const campaignModel = await CampaignModel.findOne({ where: { id } });
        return CampaignMapper.toEntity(campaignModel);		
    }

	async newCampaign(campaign: any): Promise<Campaign> {
        const campaignModel = await CampaignModel.create(campaign);
        return CampaignMapper.toEntity(campaignModel);
    }	

	async newCampaignAssociation(values: any): Promise<void> {
		
		try {
			await CampaignCustomerModel.create(values);
		} catch (error) {
			console.error(error);
			throw new Error("Custumer not association");
		}
		
	}

	async updateCampaign(id: number, data: Campaign): Promise<void> {
		
        const existingCampaign = await CampaignModel.findOne({ where: { id } });

        if (!existingCampaign) {
            throw new Error("Campaign not found");
        }       
		
		try {
			await CampaignModel.update(data, {
				where: { id }
			});
		} catch (error) {
			console.error(error);
			throw new Error("Campaign not updated");
		}
		
	}

	async getCustomersOfCampaign(campaignId: number, customerId?: number): Promise<{ campaignId: number; customer: any | null }[]> {
		const whereCondition: any = { campaignId };
		if (customerId) {
			whereCondition.customerId = customerId;
		}
		const customerCampaign = await CampaignCustomerModel.findAll({
			where: whereCondition,		
		});

		const customerDetails = await Promise.all(
			customerCampaign.map(async (customerCampaignRecord) => {
				let customerData = {};
				try {
					customerData = await searchCustomer(customerCampaignRecord.customerId);					
				} catch (error) {
					console.error(`Error fetching customer with ID ${customerCampaignRecord.customerId}:`, error.message);
				}

				// Mapeia os dados para o formato desejado
				return {
					campaignId: customerCampaignRecord.campaignId,
					customer: customerData || null,
				};
			})
		);

		return customerDetails;
	}
	async getCampaignsOfCustomer(customerId: number): Promise<{ customerId: number; campaign: any | null }[]> {
		const whereCondition: any = { customerId };
		
		const customerCampaign = await CampaignCustomerModel.findAll({
			where: whereCondition,		
		});

		const campaignDetails = await Promise.all(
			customerCampaign.map(async (campaignRecord) => {
				let campaignData = {};
				try {
					campaignData = await this.getCampaignById(campaignRecord.campaignId);					
				} catch (error) {
					console.error(`Error fetching campaign with ID ${campaignRecord.campaignId}:`, error.message);
				}

				// Mapeia os dados para o formato desejado
				return {
					customerId: campaignRecord.customerId,
					campaign: campaignData || null,
				};
			})
		);

		return campaignDetails;
	}
	
}
