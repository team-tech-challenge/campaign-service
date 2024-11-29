import { Customer } from "./Customer";

export class CampaignCustomer {
    private campaignId: number;
    private customerId: number;    

    constructor(campaignId: number, customerId: number, customer: Customer | null) {
        this.campaignId = campaignId;
        this.customerId = customerId;       
    }

    // Getters
    getCampaignId(): number {
        return this.campaignId;
    }

    getCustomerId(): number {
        return this.customerId;
    }

    //Setters

    public setCampaignId(campaignId: number): void {		
		this.campaignId = campaignId;
	}
    public setCustomerId(customerId: number): void {		
		this.customerId = customerId;
	} 
}
