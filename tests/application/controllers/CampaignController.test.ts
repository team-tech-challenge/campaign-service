import { CampaignController } from '@controllers/CampaignController';
import { CampaignUseCase } from '@usecases/CampaignUseCase';
import { Campaign } from '@entities/Campaign';
import { handleError } from '@utils/http';

jest.mock('@usecases/CampaignUseCase');
jest.mock('@utils/http');

describe('CampaignController', () => {
    let campaignController: CampaignController;
	let campaignUseCaseMock: jest.Mocked<CampaignUseCase>;
    var date_time = new Date();
    const newCampaign = new Campaign('Promoção do dia', date_time, 'teste', 10);
    beforeEach(() => {
		campaignUseCaseMock = new CampaignUseCase(null) as jest.Mocked<CampaignUseCase>;
		campaignController = new CampaignController(campaignUseCaseMock);
	});
    describe('getAll', () => {
		it('deve retornar todas as campanhas com sucesso', async () => {
			const mockCampaigns = [
				newCampaign,
			];
			campaignUseCaseMock.getAll.mockResolvedValue(mockCampaigns);

			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.getAll(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(mockCampaigns);
		});

		it('deve retornar erro ao buscar todas as campanhas', async () => {
			const error = new Error('Database error');
			campaignUseCaseMock.getAll.mockRejectedValue(error);

			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.getAll(req, res);

			expect(handleError).toHaveBeenCalledWith(res, error);
		});
	});
    describe('getCampaignById', () => {
		it('deve retornar um cliente pelo CPF', async () => {
			campaignUseCaseMock.getCampaignById.mockResolvedValue(newCampaign);

			const req = { params: { id: 1 } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.getCampaignById(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(newCampaign);
		});

		it('deve retornar erro ao buscar cliente por CPF', async () => {
			const error = new Error('Campaign not found');
			campaignUseCaseMock.getCampaignById.mockRejectedValue(error);

			const req = { params: { cpf: '78542341082' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.getCampaignById(req, res);

			expect(handleError).toHaveBeenCalledWith(res, error);
		});
	});
    describe('createCampaign', () => {
        
		it('deve criar uma nova campanha com sucesso', async () => {
            campaignUseCaseMock.createCampaign.mockResolvedValue(newCampaign);

			const req = {
				body: { name: newCampaign.getName(), endDate: newCampaign.getEndDate(), campaignRule: newCampaign.getCampaignRule(), discount: newCampaign.getDiscount() },
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.createCampaign(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(newCampaign);
		});

		it('deve retornar erro ao criar uma nova campanha', async () => {
			const error = new Error('Invalid data');
			campaignUseCaseMock.createCampaign.mockRejectedValue(error);

			const req = {
				body: { name: newCampaign.getName(), endDate: newCampaign.getEndDate(), campaignRule: newCampaign.getCampaignRule(), discount: newCampaign.getDiscount() },
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.createCampaign(req, res);

			expect(handleError).toHaveBeenCalledWith(res, error);
		});
	});

    describe('createCampaignCustomerAssociation', () => {        
		it('deve criar uma nova campanha com sucesso', async () => {
            campaignUseCaseMock.createCampaignCustomerAssociation.mockResolvedValue();

			const req = {
				body: { campaignId: 1, customerId: 1 },
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.createCampaignCustomerAssociation(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ message: 'Customer Association Created' });
		});

		it('deve retornar erro ao criar uma nova campanha', async () => {
			const error = new Error('Invalid data');
			campaignUseCaseMock.createCampaignCustomerAssociation.mockRejectedValue(error);

			const req = {
				body: { name: newCampaign.getName(), endDate: newCampaign.getEndDate(), campaignRule: newCampaign.getCampaignRule(), discount: newCampaign.getDiscount() },
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.createCampaignCustomerAssociation(req, res);

			expect(handleError).toHaveBeenCalledWith(res, error);
		});
	});

    describe('updateCampaign', () => {
		it('deve atualizar a campanha com sucesso', async () => {
			campaignUseCaseMock.updateCampaign.mockResolvedValue(newCampaign);

			const req = {
				params: { id: '1' },
				body: { name: newCampaign.getName(), endDate: newCampaign.getEndDate(), campaignRule: newCampaign.getCampaignRule(), discount: newCampaign.getDiscount() },
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.updateCampaign(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ message: 'Campaign updated successfully' });
		});

		// it('deve retornar erro ao tentar atualizar campanha', async () => {
		// 	const error = new Error('Campaign not found');
		// 	campaignUseCaseMock.updateCampaign.mockRejectedValue(error);

		// 	const req = {
		// 		params: { id: '999' },
		// 		body: { name: 'teste campanha', endDate: date_time, campaignRule: '1 pedido', discount: 10 },
		// 	};
		// 	const res = {
		// 		status: jest.fn().mockReturnThis(),
		// 		json: jest.fn(),
		// 	};

		// 	await campaignController.updateCampaign(req, res);

		// 	expect(handleError).toHaveBeenCalledWith(res, error);
		// });
	});
    describe('getCampaignCustomers', () => {
		it('deve retornar os clientes da campanha com sucesso', async () => {
            const mockCampaigns = [{ campaignId: 1, customer: { cpf: '78542341082', name: 'John D.', phoneNumber: '987654321', email: 'john.d@email.com' } }];
			campaignUseCaseMock.getCampaignCustomers.mockResolvedValue(mockCampaigns);

			const req = { params: { id: '1' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.getCampaignCustomers(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(mockCampaigns);
		});

		it('deve retornar erro ao buscar os clientes da campanha', async () => {
			const error = new Error('Customers not found');
			campaignUseCaseMock.getCampaignCustomers.mockRejectedValue(error);

			const req = { params: { id: '999' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.getCampaignCustomers(req, res);

			expect(handleError).toHaveBeenCalledWith(res, error);
		});
	});

    describe('getCustomerCampaigns', () => {
		it('deve retornar as campanhas do cliente com sucesso', async () => {
            const mockCampaigns = [{ customerId: 1, campaign: newCampaign }];
			campaignUseCaseMock.getCustomerCampaigns.mockResolvedValue(mockCampaigns);

			const req = { params: { id: '1' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.getCustomerCampaigns(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(mockCampaigns);
		});

		it('deve retornar erro ao buscar campanhas do cliente', async () => {
			const error = new Error('Campaigns not found');
			campaignUseCaseMock.getCustomerCampaigns.mockRejectedValue(error);

			const req = { params: { id: '999' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};

			await campaignController.getCustomerCampaigns(req, res);

			expect(handleError).toHaveBeenCalledWith(res, error);
		});
	});

    



});