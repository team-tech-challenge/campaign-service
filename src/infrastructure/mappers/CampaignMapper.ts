import { Campaign } from "@entities/Campaign";
import { Campaign as CampaignModel } from "@database/CampaignModel";

export class CampaignMapper {
  // Mapeia de CampaignModel (banco) para Campaign (domínio)
  static toEntity(campaignModel: any): Campaign {
    return new Campaign(
        campaignModel.name,
        campaignModel.endDate,
        campaignModel.campaignRule,
        campaignModel.discount,        
        campaignModel.id
    );
  }

  // Mapeia de Campaign (domínio) para CampaignModel (banco)
  static toModel(campaign: Campaign): any {
    return {
        name: campaign.getName(),
        endDate: campaign.getEndDate(),
        campaignRule: campaign.getCampaignRule(),      
        discount: campaign.getDiscount(),
        id: campaign.getId(),
    };
  }
}