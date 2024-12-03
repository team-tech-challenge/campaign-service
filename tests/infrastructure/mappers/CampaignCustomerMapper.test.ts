// tests/infrastructure/mappers/CampaignCustomerMapper.test.ts
import { CampaignCustomer } from "@entities/CampaignCustomer"; // Adjust the path according to your structure
import { CampaignCustomerMapper } from "@mappers/CampaignCustomerMapper"; // Adjust the path accordingly

describe('CampaignCustomerMapper', () => {
    
    describe('toEntity', () => {
        it('should map CampaignCustomerModel to CampaignCustomer entity correctly', () => {
            const campaignCustomerModel = {                
                campaignId: 1,
                customerId: 1,
            };

            const campaignCustomerEntity = CampaignCustomerMapper.toEntity(campaignCustomerModel);

            expect(campaignCustomerEntity).toBeInstanceOf(CampaignCustomer);
            expect(campaignCustomerEntity.getCampaignId()).toEqual(campaignCustomerModel.campaignId);
            expect(campaignCustomerEntity.getCustomerId()).toEqual(campaignCustomerModel.customerId);            
        });
        
    });

    describe('toModel', () => {
        it('should map CampaignCustomer entity to CampaignCustomerModel correctly', () => {
            const campaignCustomerEntity = new CampaignCustomer(1,1);

            const campaignCustomerModel = CampaignCustomerMapper.toModel(campaignCustomerEntity);

            expect(campaignCustomerModel).toEqual({
                campaignId: campaignCustomerEntity.getCampaignId(),
                customerId: campaignCustomerEntity.getCustomerId(),
            });
        });

        it('should return a valid model from a campaignCustomer entity with null id', () => {
            const campaignCustomerEntity = new CampaignCustomer(1,1);

            const campaignCustomerModel = CampaignCustomerMapper.toModel(campaignCustomerEntity);

            expect(campaignCustomerModel).toEqual({
                campaignId: campaignCustomerEntity.getCampaignId(),
                customerId: campaignCustomerEntity.getCustomerId(),
            });
        });
    });
});
