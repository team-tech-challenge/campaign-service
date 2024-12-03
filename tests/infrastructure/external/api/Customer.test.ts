import nock from 'nock';
import axios from 'axios'
import { searchCustomer } from 'src/infrastructure/external/database/api/Customer'; 

const API_BASE = process.env.CUSTOMER_SERVICE_URL || 'http://users-service:3004';

describe('searchCustomer', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('deve retornar os dados do cliente', async () => {
    const mockId = 1;
    const mockResponse = { data: 'mockData' };

    nock(API_BASE)
      .get(`/customer/${mockId}`)
      .reply(200, mockResponse);

    const result = await searchCustomer(mockId);

    expect(result).toEqual(mockResponse);
  });

  it('deve lançar um erro ao falhar a busca do cliente (erro de resposta)', async () => {
    const mockId = 1;
    const mockErrorResponse = { message: 'Not Found' };

    nock(API_BASE)
      .get(`/customer/${mockId}`)
      .reply(404, mockErrorResponse);

    await expect(searchCustomer(mockId)).rejects.toThrow('Request failed with status code 404');
  });

  it('deve lançar um erro ao falhar a busca do cliente (erro sem resposta)', async () => {
    const mockId = 1;
    const mockErrorMessage = 'No response received';

    nock(API_BASE)
      .get(`/customer/${mockId}`)
      .replyWithError({ message: mockErrorMessage });

    await expect(searchCustomer(mockId)).rejects.toThrow(mockErrorMessage);
  });

  it('deve lançar um erro ao ocorrer um problema de rede', async () => {
    const mockId = 1;
    const mockErrorMessage = 'Network Error';

    nock(API_BASE)
      .get(`/customer/${mockId}`)
      .replyWithError(mockErrorMessage);

    await expect(searchCustomer(mockId)).rejects.toThrow(mockErrorMessage);
  });

  it('deve lançar um erro quando error.response não está definido (erro genérico)', async () => {
    const mockId = 1;
    const mockErrorMessage = 'Some other error';

    // Simula um erro sem error.response
    const error = new Error(mockErrorMessage) as any;
    error.response = undefined;

    jest.spyOn(axios, 'get').mockRejectedValueOnce(error);

    try {
      await searchCustomer(mockId);
    } catch (caughtError) {
      expect(caughtError.message).toBe(mockErrorMessage);
    }
  });
});