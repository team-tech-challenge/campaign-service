import { Table, Column, DataType, Model, HasMany } from "sequelize-typescript";
import { CampaignCustomer } from "./CampaignCustomerModel";

@Table({
	timestamps: true,
	tableName: "campaign",
	modelName: "Campaign",
})
export class Campaign extends Model {
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	})
	declare id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	name: string;

	@Column({
		type: DataType.DATEONLY,
		allowNull: true,
	})
	endDate: Date;

	@Column({
		type: DataType.STRING(150),
		allowNull: true,
	})
	campaignRule: string;

	@Column({
		type: DataType.DECIMAL(18, 2),
		allowNull: true,
	})
	discount: number;

	@HasMany(() => CampaignCustomer)
	campaigncustomer: CampaignCustomer[];
	
}
