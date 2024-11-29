import { Customer } from "@entities/Customer";

export interface ICustomerGateway {
		
	getCustomerById(id: number): Promise<Customer>;
	
}
