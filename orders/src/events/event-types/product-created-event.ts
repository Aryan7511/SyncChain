import { Subjects } from '../subjects';

export interface ProductCreatedEvent {
  subject: Subjects.ProductCreated;
  data: {
    productId: string;      
    name: string;            
    description: string;   
    price: number;           
    quantity: number;             
  };
}
