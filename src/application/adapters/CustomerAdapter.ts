import axios from "axios";

import { ICustomerGateway } from "@gateways/ICustomerGateway";
import { Customer } from "@entities/Customer";
import { CustomerMapper } from "@mappers/CustomerMapper";

export class CustomerAdapter implements ICustomerGateway {  
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.CUSTOMER_SERVICE_URL || "http://customer-service:3000/api/customers";
    }  
    async getCustomerById(id: number): Promise<Customer> {    
        const fakeCustomer = new Customer("08293336650","Pedro Freitas","31993350401","pedromcdefreitas@gmail.com",1);
   
	    return fakeCustomer;   
        try {
        const response = await axios.get(`${this.baseUrl}/${customerId}`);
        return CustomerMapper.toEntity(response.data);
        } catch (error) {
        console.error("Error fetching customer:", error.message);
        return null;
        }         
    }
}