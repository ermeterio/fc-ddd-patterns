import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressCustomerChangedEvent from "../address-customer-changed.event";

export default class ShowMessageWhenChangeAddressCustomerHandler
  implements EventHandlerInterface<AddressCustomerChangedEvent>
{
    
  handle(event: AddressCustomerChangedEvent): void {    
    console.log(`Endereço do cliente: ` + event.id + `, ` + event.name + ` alterado para: ` + event.address); 
  }
}
