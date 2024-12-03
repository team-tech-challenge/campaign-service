import request from 'supertest';
import express from 'express';
import { apiRoutes } from '@routes/index'; // Adjust the path accordingly
import { CampaignController } from '@controllers/CampaignController';

// Create an Express app
const app = express();
app.use(express.json()); // For parsing application/json
app.use('', apiRoutes); // Using the apiRoutes under /api

// Mock the CampaignController and EmployeeController methods
jest.mock('@controllers/CampaignController');

const mockedCampaignController = CampaignController as jest.MockedClass<typeof CampaignController>;

describe('API Routes', () => {
	beforeEach(() => {
		// Clear all instances and calls to constructor and all methods
		mockedCampaignController.mockClear();
	});

	describe('Campaign Routes', () => {
		it('GET /campaign/all - should return all campaigns', async () => {
			const mockResponse = [{ id: 1, name: 'John Doe' }];
			mockedCampaignController.prototype.getAll.mockImplementation(async (req, res) => {
				res.status(201).json(mockResponse);
			});

			const response = await request(app).get('/campaign/all');
			expect(response.status).toBe(201);
			expect(response.body).toEqual(mockResponse);
		});

		it('POST /campaign/create - should create a new campaign', async () => {
			const newCampaign = { name: 'Primeira Campanha' };
			mockedCampaignController.prototype.createCampaign.mockImplementation(async (req, res) => {
				res.status(201).json({ id: 2, ...newCampaign });
			});

			const response = await request(app)
				.post('/campaign/create')
				.send(newCampaign)
				.set('Accept', 'application/json');
			expect(response.status).toBe(201);
			expect(response.body).toEqual({ id: 2, ...newCampaign });
		});
	});
	
});
