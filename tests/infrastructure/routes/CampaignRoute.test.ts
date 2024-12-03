import request from 'supertest';
import express from 'express';
import { campaignRoute } from '@routes/CampaignRoute';
import { CampaignController } from '@controllers/CampaignController';

// Create an Express app
const app = express();
app.use(express.json()); // For parsing application/json
app.use('/campaign', campaignRoute);

// Mock the CampaignController methods
jest.mock('@controllers/CampaignController');

const mockedController = CampaignController as jest.MockedClass<typeof CampaignController>;

describe('Campaign Routes', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        mockedController.mockClear();
    });

    it('GET /campaign/all - should return all campaigns', async () => {
        const mockResponse = [{ id: 1, name: 'Primeira Campanha' }];
        mockedController.prototype.getAll.mockImplementation(async (req, res) => {
            res.status(201).json(mockResponse);
        });

        const response = await request(app).get('/campaign/all');
        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockResponse);
    });

    it('POST /campaign/create - should create a new campaign', async () => {
        const newCampaign = { name: 'Primeira Campanha' };
        mockedController.prototype.createCampaign.mockImplementation(async (req, res) => {
            res.status(201).json({ id: 2, ...newCampaign });
        });

        const response = await request(app)
            .post('/campaign/create')
            .send(newCampaign)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: 2, ...newCampaign });
    });

    it('PUT /campaign/update/:id - should update a campaign by ID', async () => {
        const updatedCampaign = { name: 'Primeira Campanha' };
        mockedController.prototype.updateCampaign.mockImplementation(async (req, res) => {
            res.status(201).json({ id: req.params.id, ...updatedCampaign });
        });

        const response = await request(app)
            .put('/campaign/update/1')
            .send(updatedCampaign)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: '1', ...updatedCampaign });
    });    

    // it('GET /campaign/:id/customers - should get customer campaigns', async () => {
    //     const mockCampaigns = [{ campaignId: 1, customer: { cpf: '78542341082', name: 'John D.', phoneNumber: '987654321', email: 'john.d@email.com' } }];
		
    //     // Mock para simular o caso de sucesso (201)
    //     mockedController.prototype.getCustomerCampaigns.mockImplementationOnce(async (req, res) => {
    //         const { id } = req.params;
    //         if (parseInt(id, 10) === 1) {
    //             res.status(201).json(mockCampaigns);
    //         } else {
    //             res.status(404).json({ message: 'Customers not found' });
    //         }
    //     });
    
    //     // Caso de sucesso
    //     const successResponse = await request(app).get('/campaign/1/customers');
    //     expect(successResponse.status).toBe(201);
    //     expect(successResponse.body).toEqual(mockCampaigns);
    
    //     // Mock para simular o caso de erro (404)
    //     mockedController.prototype.getCustomerCampaigns.mockImplementationOnce(async (req, res) => {
    //         const { id } = req.params;
    //         res.status(404).json({ message: 'Customers not found' });
    //     });
    
    //     // Caso de erro
    //     const errorResponse = await request(app).get('/campaign/999/customers'); // ID inexistente
    //     expect(errorResponse.status).toBe(404);
    //     expect(errorResponse.body).toEqual({ message: 'Customers not found' });
    // });

    // it('GET /campaign/customer/:id - should get customer campaigns', async () => {
    //     const mockCampaigns = [{ customerId: 1, campaign: { name: 'Primeira Campanha' } }];
    
    //     // Mock para simular o caso de sucesso (201)
    //     mockedController.prototype.getCustomerCampaigns.mockImplementationOnce(async (req, res) => {
    //         const { id } = req.params;
    //         if (parseInt(id, 10) === 1) {
    //             res.status(201).json(mockCampaigns);
    //         } else {
    //             res.status(404).json({ message: 'Campaigns not found' });
    //         }
    //     });
    
    //     // Caso de sucesso
    //     const successResponse = await request(app).get('/campaign/customer/1');
    //     expect(successResponse.status).toBe(201);
    //     expect(successResponse.body).toEqual(mockCampaigns);
    
    //     // Mock para simular o caso de erro (404)
    //     mockedController.prototype.getCustomerCampaigns.mockImplementationOnce(async (req, res) => {
    //         const { id } = req.params;
    //         res.status(404).json({ message: 'Campaigns not found' });
    //     });
    
    //     // Caso de erro
    //     const errorResponse = await request(app).get('/campaign/customer/999'); // ID inexistente
    //     expect(errorResponse.status).toBe(404);
    //     expect(errorResponse.body).toEqual({ message: 'Campaigns not found' });
    // });

    it('GET /campaign/:id - should get campaign by ID', async () => {
        const mockCampaign = { id: 1, name: 'Primeira Campanha' };
        mockedController.prototype.getCampaignById.mockImplementation(async (req, res) => {
            res.status(201).json(mockCampaign);
        });

        const response = await request(app).get('/campaign/1');
        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockCampaign);
    });
});