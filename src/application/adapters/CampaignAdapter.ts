import { Campaign as CampaignModel } from "@database/CampaignModel";
import { CampaignCustomer as CampaignCustomerModel } from "@database/CampaignCustomerModel";
import { ICampaignGateway } from "@gateways/ICampaignGateway";
import { Campaign } from "@entities/Campaign";
import { CampaignCustomer } from "@entities/CampaignCustomer";
import { CampaignMapper } from "@mappers/CampaignMapper";
import { CampaignCustomerMapper } from "@mappers/CampaignCustomerMapper";

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

	async customersOfCampaign(campaignId: number, customerId?: number): Promise<CampaignCustomer[]> {
		const whereCondition: any = { campaignId };
		if (customerId) {
			whereCondition.customerId = customerId;
		}
		const customerCampaign = await CampaignCustomerModel.findAll({
			where: whereCondition,			
			order: [['id', 'DESC']],
		});

		return customerCampaign.map((customerCampaignRecord) => CampaignCustomerMapper.toEntity(customerCampaignRecord));	
	
	}
}
