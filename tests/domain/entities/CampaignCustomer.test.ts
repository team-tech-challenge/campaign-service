import { CampaignCustomer } from '@entities/CampaignCustomer'; // Caminho para o seu arquivo

describe('CampaignCustomer', () => {
    describe('getCampaignId', () => {        
        it('deve retornar o id se existir', () => {			
            const campaignCustomer = new CampaignCustomer(1,1);
			expect(campaignCustomer.getCampaignId()).toBe(1);
		});
       
	});
    describe('getCustomerId', () => {        
        it('deve retornar o id se existir', () => {		
            const campaignCustomer = new CampaignCustomer(1,1);	
            expect(campaignCustomer.getCustomerId()).toBe(1);
		});
       
	});
    describe('setCampaignId', () => {		
		it('não deve lançar erro se o nome for válido', () => {		
            const campaignCustomer = new CampaignCustomer(1,1);	
			expect(campaignCustomer.getCampaignId()).toBe(1);
		});
	});
    describe('setCustomerId', () => {		
		it('não deve lançar erro se o nome for válido', () => {		
            const campaignCustomer = new CampaignCustomer(1,1);	
			expect(campaignCustomer.getCustomerId()).toBe(1);
		});
	});
});
