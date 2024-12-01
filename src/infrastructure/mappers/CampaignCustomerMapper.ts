import { CampaignCustomer } from "@entities/CampaignCustomer";

export class CampaignCustomerMapper {
  static toEntity(campaignCustomerModel: any): CampaignCustomer {
    return new CampaignCustomer(
      campaignCustomerModel.campaignId,
      campaignCustomerModel.customerId,      
    );
  }

  static toModel(campaignCustomer: CampaignCustomer): any {
    return {
      campaignId: campaignCustomer.getCampaignId(),
      customerId: campaignCustomer.getCustomerId(),
    };
  }
}

