import { CampaignCustomer } from "@entities/CampaignCustomer";
import { CustomerMapper } from "./CustomerMapper";

export class CampaignCustomerMapper {
  static toEntity(campaignCustomerModel: any): CampaignCustomer {
    return new CampaignCustomer(
      campaignCustomerModel.campaignId,
      campaignCustomerModel.customerId,      
    );
  }

  static toModel(campaignCustomer: CampaignCustomer): any {
    return {
      comboId: campaignCustomer.getCampaignId(),
      productId: campaignCustomer.getCustomerId(),
    };
  }
}

