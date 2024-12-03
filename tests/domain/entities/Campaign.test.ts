import { Campaign } from '@entities/Campaign'; // Caminho para o seu arquivo

describe('Campaign', () => {
    var date_time = new Date();
    describe('getId', () => {
        
        it('deve retornar o id se existir', () => {			
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10, 1);
			expect(campaign.getId()).toBe(1);
		});

        it('deve retornar undefined se o id não existir', () => {
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);			
			expect(campaign.getId()).toBeUndefined();
		});
	});
    describe('getName', () => {
		it('deve retornar o nome da campanha se existir', () => {	
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);		
			expect(campaign.getName()).toBe('Primeira Campanha');
		});
	});
    describe('getEndDate', () => {
		it('deve retornar o a data do fim da campanha se existir', () => {	
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);		
			expect(campaign.getEndDate()).toBe(date_time);
		});
	});
    describe('getCampaignRule', () => {
		it('deve retornar o a regra da campanha se existir', () => {	
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);		
			expect(campaign.getCampaignRule()).toBe('Regra Primeiro pedido');
		});
	});
    describe('getDiscount', () => {
		it('deve retornar o desconto se existir', () => {	
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);		
			expect(campaign.getDiscount()).toBe(10);
		});
	});

	describe('setName', () => {		
		it('não deve lançar erro se o nome for válido', () => {		
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);	
			// Retirando os caracteres especiais, o CPF deve ser '78542341082'
			expect(campaign.getName()).toBe('Primeira Campanha');
		});
	});
	describe('setCampaignRule', () => {		
		it('não deve lançar erro se a regra for válido', () => {	
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);		
			// Retirando os caracteres especiais, o CPF deve ser '78542341082'
			expect(campaign.getCampaignRule()).toBe('Regra Primeiro pedido');
		});
	});
	describe('setDiscount', () => {		
		it('não deve lançar erro se o desconto for válido', () => {	
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);		
			// Retirando os caracteres especiais, o CPF deve ser '78542341082'
			expect(campaign.getDiscount()).toBe(10);
		});
	});
	describe('setEndDate', () => {		
		it('não deve lançar erro se o a data for válido', () => {	
            const campaign = new Campaign('Primeira Campanha', date_time, 'Regra Primeiro pedido', 10);		
			// Retirando os caracteres especiais, o CPF deve ser '78542341082'
			expect(campaign.getEndDate()).toBe(date_time);
		});
	});

	
});
