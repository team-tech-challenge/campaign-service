// tests/infrastructure/mappers/CampaignMapper.test.ts
import { Campaign } from "@entities/Campaign"; // Adjust the path according to your structure
import { CampaignMapper } from "@mappers/CampaignMapper"; // Adjust the path accordingly

describe('CampaignMapper', () => {
    var date_time = new Date();

    describe('toEntity', () => {
        it('should map CampaignModel to Campaign entity correctly', () => {
            const campaignModel = {
                name: 'Primeiro Pedido', // Use a valid CPF here
                endDate: date_time,
                campaignRule: 'Regra Primeiro Pedido',
                discount: 10,
                id: 1,
            };

            const campaignEntity = CampaignMapper.toEntity(campaignModel);

            expect(campaignEntity).toBeInstanceOf(Campaign);
            expect(campaignEntity.getName()).toEqual(campaignModel.name);
            expect(campaignEntity.getEndDate()).toEqual(campaignModel.endDate);
            expect(campaignEntity.getCampaignRule()).toEqual(campaignModel.campaignRule);
            expect(campaignEntity.getDiscount()).toEqual(campaignModel.discount);
            expect(campaignEntity.getId()).toEqual(campaignModel.id);
        });
        
    });

    describe('toModel', () => {
        it('should map Campaign entity to CampaignModel correctly', () => {
            const campaignEntity = new Campaign('Promoção do dia', date_time, 'teste', 10, 1);

            const campaignModel = CampaignMapper.toModel(campaignEntity);

            expect(campaignModel).toEqual({
                name: campaignEntity.getName(),
                endDate: campaignEntity.getEndDate(),
                campaignRule: campaignEntity.getCampaignRule(),
                discount: campaignEntity.getDiscount(),
                id: campaignEntity.getId(),
            });
        });

        it('should return a valid model from a campaign entity with null id', () => {
            const campaignEntity = new Campaign('Promoção do dia', date_time, 'teste', 10);

            const campaignModel = CampaignMapper.toModel(campaignEntity);

            expect(campaignModel).toEqual({
                name: campaignEntity.getName(),
                endDate: campaignEntity.getEndDate(),
                campaignRule: campaignEntity.getCampaignRule(),
                discount: campaignEntity.getDiscount(),
                id: campaignEntity.getId(),
            });
        });
    });
});
