import { Table, Column, DataType, Model, BelongsTo, ForeignKey} from "sequelize-typescript";
import { Campaign } from "@database/CampaignModel";

@Table({
	timestamps: true,
	tableName: "campaign_customer",
	modelName: "CampaignCustomer",
})
export class CampaignCustomer extends Model {
	
	@ForeignKey(() => Campaign)
	@Column({		
		type: DataType.INTEGER,
	})
	declare campaignId: number;
	
	@Column({		
		type: DataType.INTEGER,
	})
	declare customerId: number;

	// Relacionamento de Muitos para Um com Campaign
	@BelongsTo(() => Campaign)
	campaign: Campaign;
}
