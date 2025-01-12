export class ServiceType {
  public serviceTypeCode!:number;
    public serviceId: string;
    public description: string;
    public lastChangeDate!: Date;

    constructor(serviceId:string,description: string
    ) {
        this.serviceId = serviceId;
      this.description=description;
    }
}