// import { CampaignAdapter } from "@adapters/CampaignAdapter";
// import { Campaign as CampaignModel } from "@database/CampaignModel";
// import { CampaignCustomer as CampaignCustomerModel } from "@database/CampaignCustomerModel";
// import { CampaignMapper } from "@mappers/CampaignMapper";
// import { CampaignCustomerMapper } from "@mappers/CampaignCustomerMapper";
// import { Campaign } from "@entities/Campaign";
// import { CampaignCustomer } from "@entities/CampaignCustomer";

// jest.mock("@database/CampaignModel");
// jest.mock("@mappers/CampaignMapper");
// jest.mock("@database/CampaignCustomerModel");
// jest.mock("@mappers/CampaignCustomerMapper");

// describe("CampaignAdapter", () => {
//     let campaignAdapter: CampaignAdapter;

//     beforeEach(() => {
//         campaignAdapter = new CampaignAdapter();
//         jest.clearAllMocks();
//     });

//     describe("allCampaigns", () => {
//         it("should fetch all campaigns and map them to domain entities", async () => {
//             // Mock data from the database
//             const mockCampaignModels = [
//                 { id: 1, name: "Campaign A", endDate: new Date(), discount: 10 },
//                 { id: 2, name: "Campaign B", endDate: new Date(), discount: 20 },
//             ];
            
//             // Mock mapped entities
//             const mockCampaignEntities: Campaign[] = [
//                 new Campaign("Campaign A", new Date(), "Rule A", 10, 1),
//                 new Campaign("Campaign B", new Date(), "Rule B", 20, 2),
//             ];

//             // Mock implementation of findAll and toEntity
//             (CampaignModel.findAll as jest.Mock).mockResolvedValue(mockCampaignModels);
//             (CampaignMapper.toEntity as jest.Mock)
//                 .mockImplementation((model) => mockCampaignEntities.find(entity => entity.getId() === model.id));

//             // Call the method
//             const campaigns = await campaignAdapter.allCampaigns();

//             // Assertions
//             expect(CampaignModel.findAll).toHaveBeenCalledTimes(1);
//             expect(CampaignMapper.toEntity).toHaveBeenCalledTimes(mockCampaignModels.length);
//             expect(campaigns).toEqual(mockCampaignEntities);
//         });

//         it("should return an empty array if no campaigns are found", async () => {
//             // Mock findAll to return an empty array
//             (CampaignModel.findAll as jest.Mock).mockResolvedValue([]);

//             // Call the method
//             const campaigns = await campaignAdapter.allCampaigns();

//             // Assertions
//             expect(CampaignModel.findAll).toHaveBeenCalledTimes(1);
//             expect(CampaignMapper.toEntity).not.toHaveBeenCalled();
//             expect(campaigns).toEqual([]);
//         });
//     });

//     describe("getCampaignById", () => {
//         it("should fetch a campaign by ID and map it to a domain entity", async () => {
//             // Mock campaign model from the database
//             const mockCampaignModel = {
//                 id: 1,
//                 name: "Campaign A",
//                 endDate: new Date(),
//                 discount: 15,
//                 campaignRule: "Rule A",
//             };

//             // Mock mapped entity
//             const mockCampaignEntity = new Campaign(
//                 "Campaign A",
//                 mockCampaignModel.endDate,
//                 "Rule A",
//                 15,
//                 1
//             );

//             // Mock implementations
//             (CampaignModel.findOne as jest.Mock).mockResolvedValue(mockCampaignModel);
//             (CampaignMapper.toEntity as jest.Mock).mockReturnValue(mockCampaignEntity);

//             // Call the method
//             const campaign = await campaignAdapter.getCampaignById(1);

//             // Assertions
//             expect(CampaignModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
//             expect(CampaignMapper.toEntity).toHaveBeenCalledWith(mockCampaignModel);
//             expect(campaign).toEqual(mockCampaignEntity);
//         });

//         it("should throw an error if campaign is not found", async () => {
//             // Mock findOne to return null
//             (CampaignModel.findOne as jest.Mock).mockResolvedValue(null);

//             // Call the method and assert the error
//             await expect(campaignAdapter.getCampaignById(1)).rejects.toThrow("Campaign not found");

//             // Assertions
//             expect(CampaignModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
//             expect(CampaignMapper.toEntity).not.toHaveBeenCalled();
//         });
//     });
//     describe("newCampaign", () => {
//         const campaignAdapter = new CampaignAdapter();
    
//         afterEach(() => {
//             jest.clearAllMocks();
//         });
    
//         it("should create a new campaign and return the entity", async () => {
//             // Mock data
//             const mockCampaignData = {
//                 name: "Primeira campanha",                
//                 endDate: new Date("2024-12-01"),
//                 campaignRule: 'Teste',
//                 discount: 20,
//             };
    
//             const mockCampaignModel = {
//                 id: 1,
//                 ...mockCampaignData,
//             };
    
//             const mockCampaignEntity = new Campaign(
//                 mockCampaignModel.name,               
//                 mockCampaignModel.endDate,
//                 mockCampaignModel.campaignRule,
//                 mockCampaignModel.discount,
//                 mockCampaignModel.id
//             );
    
//             // Mock implementation
//             (CampaignModel.create as jest.Mock).mockResolvedValue(mockCampaignModel);
//             (CampaignMapper.toEntity as jest.Mock).mockReturnValue(mockCampaignEntity);
    
//             // Call the method
//             const result = await campaignAdapter.newCampaign(mockCampaignData);
    
//             // Assertions
//             expect(CampaignModel.create).toHaveBeenCalledWith(mockCampaignData);
//             expect(CampaignMapper.toEntity).toHaveBeenCalledWith(mockCampaignModel);
//             expect(result).toEqual(mockCampaignEntity);
//         });
    
//         it("should throw an error if creation fails", async () => {
//             // Mock implementation to simulate an error
//             (CampaignModel.create as jest.Mock).mockRejectedValue(new Error("Database error"));
    
//             // Call the method and verify it throws
//             await expect(campaignAdapter.newCampaign({})).rejects.toThrow("Database error");
    
//             // Assertions
//             expect(CampaignModel.create).toHaveBeenCalledWith({});
//             expect(CampaignMapper.toEntity).not.toHaveBeenCalled();
//         });
//     });    
// });
