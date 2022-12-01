import EventInterface from "../../@shared/event/event.interface";

export default class AddressCustomerChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;
  id: number;
  name: string;
  address: string;

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
    this.id = eventData.id;
    this.name = eventData.name;
    this.address = eventData.address;
  }
}
