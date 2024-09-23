export interface Style {
  id: number;
  buyerCode: number;
  buyer: string;
  order: string;
  typeCode: number;
  type: string;
  styleCode: string;
  orderDate: Date;
  unit: string;
  quantity: number;
  unitPrice: number;
  exportBalance: number;
  supplierReturn: number;
  customerReturn: number;
  username: string;
  approvedDate: Date;
  productionEndDate: Date;
  estimateApprovalDate: Date;
  estimateApprovalUserName: string;
  exported: boolean;
}
