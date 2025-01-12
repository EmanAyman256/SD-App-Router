export class ModelEntity {
    public modelSpecCode!: number;
    public modelSpecDetailsCode: number[]= [];
    public currencyCode:number;
    public modelServSpec: string;
    public blockingIndicator: boolean;
    public serviceSelection: boolean;
    public description: string;
    public searchTerm: string;
   
    constructor(currencyCode:number,modelServSpec: string,blockingIndicator: boolean,serviceSelection: boolean,
        description: string,searchTerm: string
    ) {
       this.currencyCode = currencyCode;
      this.modelServSpec=modelServSpec;
      this.blockingIndicator=blockingIndicator;
      this.serviceSelection=serviceSelection; 
      this.description=description;
      this.searchTerm=searchTerm;
    }
}