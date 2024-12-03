export class Campaign {
	private id?: number;
	private name: string;
	private endDate: Date;
	private campaignRule: string;
	private discount: number;	

	constructor(name: string, endDate: Date, campaignRule: string, discount: number, id?: number) {
		this.id = id;
		this.name = name;
		this.endDate = endDate;
		this.campaignRule = campaignRule;
		this.discount = discount;
	}

	getId(): number | undefined {
		return this.id;
	}

	getName(): string {
		return this.name;
	}

	getEndDate(): Date {
		return this.endDate;
	}
	
	getCampaignRule(): string {
		return this.campaignRule;
	}
	
	getDiscount(): number {
		return this.discount;
	}

	public setId(id: number): void {		
		this.id = id;
	}
	public setName(name: string): void {		
		this.name = name;
	}
	public setCampaignRule(campaignRule: string): void {		
		this.campaignRule = campaignRule;
	}
	public setDiscount(discount: number): void {		
		this.discount = discount;
	}
	public setEndDate(endDate: Date): void {		
		this.endDate = endDate;
	}
	
}
