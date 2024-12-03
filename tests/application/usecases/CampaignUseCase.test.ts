import { CampaignUseCase } from "@usecases/CampaignUseCase";
import { ICampaignGateway } from "@gateways/ICampaignGateway";
import { Campaign } from "@entities/Campaign";
import { CampaignCustomer } from "@entities/CampaignCustomer";

jest.mock("@entities/Campaign", () => {
	return {
		Campaign: jest.fn().mockImplementation((id, name, endDate, campaignRule, discount) => {
			return {
				getId: jest.fn(() => id),
				getName: jest.fn(() => name),
				getEndDate: jest.fn(() => endDate),
				getCampaignRule: jest.fn(() => campaignRule),
				getDiscount: jest.fn(() => discount),				
			};
		}),
	};
});

describe("CampaignUseCase", () => {
	let campaignGateway: jest.Mocked<ICampaignGateway>;
	let campaignUseCase: CampaignUseCase;
	let mockCampaign: Campaign;
	let mockCampaignCustomer: CampaignCustomer;

	beforeEach(() => {
		campaignGateway = {
			allCampaigns: jest.fn(),
			getCampaignById: jest.fn(),			
			newCampaign: jest.fn(),
			newCampaignAssociation: jest.fn(),
			updateCampaign: jest.fn(),			
			getCustomersOfCampaign: jest.fn(),
			getCampaignsOfCustomer: jest.fn(),
		};
		campaignUseCase = new CampaignUseCase(campaignGateway);		
        var date_time = new Date();
		mockCampaign = new Campaign('Promoção do dia', date_time, 'teste', 10); // Usando o mock.
		mockCampaignCustomer = new CampaignCustomer(1,2); // Usando o mock.
	});

	describe("getAll", () => {
		it("should return all campaigns", async () => {
			campaignGateway.allCampaigns.mockResolvedValue([mockCampaign]);
			const campaigns = await campaignUseCase.getAll();
			expect(campaigns).toEqual([mockCampaign]);
			expect(campaignGateway.allCampaigns).toHaveBeenCalled();
		});
	});

    describe("getCampaignById", () => {
		it("should return a campaign by CPF", async () => {			
			campaignGateway.getCampaignById.mockResolvedValue(mockCampaign);
			const campaign = await campaignUseCase.getCampaignById(1);
			expect(campaign).toEqual(mockCampaign);
			expect(campaignGateway.getCampaignById).toHaveBeenCalledWith(1);
		});
	});
    
	describe("createCampaign", () => {
		it("should create a campaign", async () => {			
			campaignGateway.newCampaign.mockResolvedValue(mockCampaign);
			const campaign = await campaignUseCase.createCampaign(mockCampaign);
			expect(campaign).toEqual(mockCampaign);
			expect(campaignGateway.newCampaign).toHaveBeenCalledWith(mockCampaign);
		});

		it("should return null if campaign is not found", async () => {
			campaignGateway.getCampaignById.mockResolvedValue(null);
			const campaign = await campaignUseCase.getCampaignById(1);
			expect(campaign).toBeNull();
		});
	});
	
    describe("createCampaignCustomerAssociation", () => {		
		
		it("should create a campaign association customer", async () => {
			// Mock para simular os comportamentos esperados
			campaignGateway.getCampaignById.mockResolvedValue(mockCampaign);
			campaignGateway.getCustomersOfCampaign.mockResolvedValue([]); // Sem clientes associados
			campaignGateway.newCampaignAssociation.mockResolvedValue(undefined); // Simula criação bem-sucedida

			// Chamada ao caso de uso
			await campaignUseCase.createCampaignCustomerAssociation(mockCampaignCustomer);

			// Verificações
			expect(campaignGateway.getCampaignById).toHaveBeenCalledWith(mockCampaignCustomer.getCampaignId());
			expect(campaignGateway.getCustomersOfCampaign).toHaveBeenCalledWith(mockCampaignCustomer.getCampaignId(), mockCampaignCustomer.getCustomerId());
			expect(campaignGateway.newCampaignAssociation).toHaveBeenCalledWith(mockCampaignCustomer);
		});

		it("should throw an error if campaign is not found", async () => {
			// Mock para simular campanha inexistente
			campaignGateway.getCampaignById.mockResolvedValue(null);

			// Verificação do erro
			await expect(campaignUseCase.createCampaignCustomerAssociation(mockCampaignCustomer)).rejects.toThrow("Campaign not found");
		});

		it("should throw an error if customer is already registered in the campaign", async () => {
			// Mock para simular cliente já associado
			campaignGateway.getCampaignById.mockResolvedValue(mockCampaign);
			campaignGateway.getCustomersOfCampaign.mockResolvedValue([{campaignId: 1, customer: { cpf: '78542341082', name: 'John D.', phoneNumber: '987654321', email: 'john.d@email.com' }}]);

			// Verificação do erro
			await expect(campaignUseCase.createCampaignCustomerAssociation(mockCampaignCustomer)).rejects.toThrow("Customer already registered in the campaign.");
		});
	});

	

	describe("updateCampaign", () => {
		it("should update a campaign with valid data", async () => {
			campaignGateway.getCampaignById.mockResolvedValue(mockCampaign);			
			await campaignUseCase.updateCampaign(1, mockCampaign);
			expect(campaignGateway.updateCampaign).toHaveBeenCalledWith(1, mockCampaign);
		});

		it("should throw an error if campaign is not found", async () => {
			campaignGateway.getCampaignById.mockResolvedValue(null);
			await expect(campaignUseCase.updateCampaign(1, mockCampaign)).rejects.toThrow();
		});

		it("should return null if campaign is not found", async () => {
			campaignGateway.getCampaignById.mockResolvedValue(null);
			const campaign = await campaignUseCase.getCampaignById(1);
			expect(campaign).toBeNull();
		});
	});	

	describe("getCampaignCustomers", () => {
		it("should return customers for a campaign", async () => {
			campaignGateway.getCustomersOfCampaign.mockResolvedValue([{ campaignId: 1, customer: { cpf: '78542341082', name: 'John D.', phoneNumber: '987654321', email: 'john.d@email.com' } }]);
			const campaigns = await campaignUseCase.getCampaignCustomers(1);
			expect(campaigns).toEqual([{ campaignId: 1, customer: { cpf: '78542341082', name: 'John D.', phoneNumber: '987654321', email: 'john.d@email.com' } }]);
			expect(campaignGateway.getCustomersOfCampaign).toHaveBeenCalledWith(1);
		});
		it("should return null if customer is not found", async () => {
			campaignGateway.getCustomersOfCampaign.mockResolvedValue(null);
			const campaignCustomer = await campaignUseCase.getCustomerCampaigns(1);
			expect(campaignCustomer).toBeNull();
		});
	});
    
	describe("getCustomerCampaigns", () => {
		it("should return customers for a campaign", async () => {
			campaignGateway.getCampaignsOfCustomer.mockResolvedValue([{ customerId: 1, campaign: mockCampaign }]);
			const campaigns = await campaignUseCase.getCustomerCampaigns(1);
			expect(campaigns).toEqual([{ customerId: 1, campaign: mockCampaign}]);
			expect(campaignGateway.getCampaignsOfCustomer).toHaveBeenCalledWith(1);
		});
		it("should return null if customer is not found", async () => {
			campaignGateway.getCampaignsOfCustomer.mockResolvedValue(null);
			const campaignCustomer = await campaignUseCase.getCustomerCampaigns(1);
			expect(campaignCustomer).toBeNull();
		});
	});
});
