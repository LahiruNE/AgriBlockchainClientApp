import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.ucsc.agriblockchain{
   export class Product extends Asset {
      productId: string;
      pluckedDate: Date;
      certification: Certification;
      productType: ProductType;
      quantity: number;
      unit: Unit;
      divideStatus: DivideStatus;
      activeStatus: ActiveStatus;
      productpath: Trace[];
      plot: Plot;
      parentProduct: Product;
      currentOwner: Stakeholder;
      issuer: Stakeholder;
   }
   export class Plot extends Asset {
      plotId: string;
      cultivationStartDate: Date;
      seededDate: Date;
      extent: number;
      closerplots: Directions;
      activities: Activity[];
      phReadings: PHReading[];
      certificationBodyComments: string[];
      status : PlotStatus;
      cultivatedType : ProductType;
      farm: Farm;
   }
   export class Farm extends Asset {
      farmId: string;
      FarmLocation: string;
      images: string[];
      waterSources: Directions;
      nearFactories: Directions;
      otherDescription: string;
      certification: Certification;
      owner: Stakeholder;
      farmers: Stakeholder[];
   }
   export class Seed extends Asset {
      seedId: string;
      name: string;
      manufactureDate: Date;
      expiryDate: Date;
      dateOfSale: Date;
      type : ProductType;
      amount: number;
      price: number;
      activeChemicals: string[];
      certification: Certification;
      currentOwner: Stakeholder;
      productpath :Trace[];
      issuer: Stakeholder;
      parentProduct: Seed;
      divideStatus: DivideStatus; 
      activeStatus: ActiveStatus; 
   }
   export class Fertilizer extends Asset {
      fertilizerId: string;
      name: string;
      manufactureDate: Date;
      expiryDate: Date;
      dateOfSale: Date;
      amount: number;
      price: number;
      activeChemicals: string[];
      certification: Certification;
      currentOwner: Stakeholder;
      productpath :Trace[];
      issuer: Stakeholder;
      parentProduct: Fertilizer;
      divideStatus: DivideStatus; 
      activeStatus: ActiveStatus;
   }
   export class Pesticide extends Asset {
      pesticideId: string;
      name: string;
      manufactureDate: Date;
      expiryDate: Date;
      dateOfSale: Date;
      amount: number;
      price: number;
      activeChemicals: string[];
      certification: Certification;
      currentOwner: Stakeholder;
      productpath :Trace[];
      issuer: Stakeholder;
      parentProduct: Pesticide;
      divideStatus: DivideStatus; 
      activeStatus: ActiveStatus;
   }
   export class Directions {
      North: string;
      East: string;
      South: string;
      West: string;
   }
   export class Trace {
      timestamp: Date;
      authperson: Stakeholder;
   }
   export class Address {
      postalCode: string;
      no: string;
      street: string;
      city: string;
      country: string;
   }
   export class Company {
      name: string;
      address: Address;
      telephone: string;
   }
   export class Certification {
      certificationNo: string;
      certificationBody: Stakeholder;
      from: Date;
      to: Date;
      images: string[];
      comment: string[];
   }
   export enum ProductType {
      CARROT,
      TOMATO,
      PINEAPPLE,
   }

   export enum PlotStatus {
      NEW,
      HARVESTED,
      SEEDED
  }

   export enum DistType {
      F2P,
      P2W,
      W2R,
   }
   export enum Unit {
      KG,
      G,
      MT,
      L,
      ML,
      ITEM,
   }
   export enum DivideStatus {
      ORIGINAL,
      DIVIDED,
      MERGED,
   }
   export enum ActiveStatus {
      ACTIVE,
      CLOSED,
   }
   export enum ActivityType {
      LANDSCAPING,
      WATERING,
      MANURING
   }
   export enum StakeholderType {
      ADMIN,
      FARMER,
      DISTRIBUTION,
      PACKAGING,
      WAREHOUSE,
      RETAIL,
      FERTILIZER,
      SEED,
      PESTICIDE,
      CERTIFICATION,
   }
   export class Stakeholder extends Participant {
      stakeholderId: string;
      name: string;
      address: Address;
      email: string;
      telephone: string;
      certification: Certification;
      images: string[];
      company: Company;
      username: string;
      password: string;
      type: StakeholderType;
      description: string;
      authPerson: string;
      vehicleNo: string;
      distributionType: DistType;
      branchNo: string;
      comment:string;
      rating:string;
   }
   export class TransferPackage extends Transaction {
      product: Product;
      newOwner: Stakeholder;
   }
   export class DivideAsset extends Transaction {
      product: Product;
      divideQty: number[];
   }
   export class MergeAsset extends Transaction {
      product: Product[];
   }
   export class PHReading extends Transaction {
      plot: Plot;
      ph: number;
      readingTime: Date;
   }
   export class Activity extends Transaction {
      plot: Plot;
      activitytype: ActivityType;
      fertilizer: Fertilizer; 
      pesticide: Pesticide;
      amount: number;
      time: Date;
   }
   export class PHThresholdEvent extends Event {
      plot: Plot;
      message: string;
      phvalue: number;
      readingTime: Date;
   }
// }
