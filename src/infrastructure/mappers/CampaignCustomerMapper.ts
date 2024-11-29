import { CampaignCustomer } from "@entities/CampaignCustomer";
import { CustomerMapper } from "./CustomerMapper";

export class CampaignCustomerMapper {
  static toEntity(campaignCustomer: any): CampaignCustomer {
    const customer = campaignCustomer.customer ? CustomerMapper.toEntity(campaignCustomer.customer) : null; // Verifica se o produto está presente
    return new CampaignCustomer(campaignCustomer.campaignId, campaignCustomer.customerId, customer);
  }

  static toModel(campaignCustomer: CampaignCustomer): any {
    return {
      comboId: campaignCustomer.getCampaignId(),
      productId: campaignCustomer.getCustomerId(),
    };
  }
}