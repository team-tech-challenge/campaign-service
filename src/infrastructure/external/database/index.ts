import connection from "@config/connectionFactory";
import { Campaign } from "@database/CampaignModel";
import { CampaignCustomer } from "@database/CampaignCustomerModel";

export default () => {
	connection.database.addModels([		
		Campaign,		
		CampaignCustomer,		
	]);
};
