import swaggerAutogen from "swagger-autogen";

const doc = {
	info: {
		version: "v1.0.0",
		title: "Swagger Tech Challenge",
		description: "Tech Challenge API",
	},
	servers: [
		{
			url: "http://localhost:3000",
		},
	],
	definitions: {		
		Campaign: {
			name: "Campaign Name",
			campaignRule: "Campaign Rule",
			discount: "10",
			endDate: "2025-10-20",
		},		
		AddCampaignCustomer: {
			campaignId: 1,
			customerId: 1,
		},
	},
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/infrastructure/config/routes.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
