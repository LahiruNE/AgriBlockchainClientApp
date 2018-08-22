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
      extent: number;
      closerplots: CloserPlots;
      activities: Activity[];
      phReadings: PHReading[];
      certificationBodyComments: string[];
      farm: Farm;
   }
   export class Farm extends Asset {
      farmId: string;
      FarmLocation: string;
      images: string[];
      waterSources: string[];
      nearFactories: string[];
      otherDescription: string;
      certification: Certification;
   }
   export class Seed extends Asset {
      seedId: string;
      name: string;
      manufactureDate: Date;
      expiryDate: Date;
      dateOfSale: Date;
      amount: number;
      price: number;
      activeChemicals: string[];
      certification: Certification;
      vendor: SeedProvider;
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
      vendor: FertilizerProvider;
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
      vendor: PesticideProvider;
   }
   export class CloserPlots {
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
      certificationBody: CertificationBody;
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
   }
   export abstract class Stakeholder extends Participant {
      name: string;
      address: Address;
      email: string;
      telephone: string;
      certification: Certification;
      images: string[];
      company: Company;
   }
   export class Farmer extends Stakeholder {
      stakeholderId: string;
      description: string;
      farms: Farm[];
   }
   export class Distribution extends Stakeholder {
      stakeholderId: string;
      description: string;
      authPerson: string;
      vehicleNo: string;
      type: DistType;
   }
   export class Packaging extends Stakeholder {
      stakeholderId: string;
      description: string;
      authPerson: string;
   }
   export class Warehouse extends Stakeholder {
      stakeholderId: string;
      description: string;
      authPerson: string;
   }
   export class Retail extends Stakeholder {
      stakeholderId: string;
      description: string;
      authPerson: string;
      branchNo: string;
   }
   export class SeedProvider extends Stakeholder {
      seedProviderId: string;
      description: string;
      authPerson: string;
   }
   export class FertilizerProvider extends Stakeholder {
      fertilizerProviderId: string;
      description: string;
      authPerson: string;
   }
   export class PesticideProvider extends Stakeholder {
      pesticideProviderId: string;
      description: string;
      authPerson: string;
   }
   export class CertificationBody extends Stakeholder {
      certificationBodyId: string;
      description: string;
      authPerson: string;
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
      time: Date;
   }
   export class PHThresholdEvent extends Event {
      plot: Plot;
      message: string;
      phvalue: number;
      readingTime: Date;
   }
// }
