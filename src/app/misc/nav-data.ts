export const navbarData = [
  { routerLink: '', ico: '', label: 'Home', subMenus: null, tag: null },
  {
    routerLink: 'register',
    ico: '',
    label: 'Register',
    subMenus: null,
    tag: null,
  },
  {
    routerLink: 'general',
    icon: '',
    label: 'General',
    subMenus: [
      { routerLink: 'currency-table', icon: 'table', label: 'Currency' },
      { routerLink: 'country-table', icon: 'table', label: 'Country' },
      {
        routerLink: 'garment-type-table',
        icon: 'table',
        label: 'Garment Type',
      },
      {
        routerLink: 'currency-exchange-table',
        icon: 'table',
        label: 'Currency Exchange',
      },
      // {
      //   routerLink: 'currency-conversion-table',
      //   icon: '',
      //   label: 'Currency Conversion',
      // },
      {
        routerLink: 'unit-table',
        icon: 'table',
        label: 'Unit',
      },
      {
        routerLink: 'bank-table',
        icon: 'table',
        label: 'Bank',
      },
      {
        routerLink: 'address-table',
        icon: 'table',
        label: 'Address',
      },
    ],
    tag: 'general',
  },
  {
    routerLink: 'ordermanagementref',
    icon: '',
    label: 'Order Mgt Ref',
    subMenus: [
      {
        routerLink: 'buyer-table',
        icon: 'build',
        label: 'Buyer',
      },
      { routerLink: 'suppref', icon: 'build', label: 'Supplier' },
      {
        routerLink: 'currencyconversion',
        icon: 'attach_money',
        label: 'Country wise Dest./Port',
      },
      {
        routerLink: 'garmenttype',
        icon: 'attach_money',
        label: 'Garment Type',
      },
      {
        routerLink: 'featurereference',
        icon: 'attach_money',
        label: 'Feature Reference',
      },
      {
        routerLink: 'itemfeature',
        icon: 'assignment',
        label: 'Item / Feature',
      },
      {
        routerLink: 'style-details',
        icon: 'assignment',
        label: 'Style Details',
      },
    ],
    tag: 'ordermanagementref',
  },

  {
    routerLink: 'ordermanagement',
    icon: 'assignment',
    label: 'Order Management',
    subMenus: [
      {
        routerLink: 'po',
        icon: 'assignment',
        label: 'Order Confirmation Routine',
      },
      {
        routerLink: 'material',
        icon: 'assignment',
        label: 'Material Consumptions',
      },
      {
        routerLink: 'additional',
        icon: 'assignment',
        label: 'Additional Costs per Garment',
      },
      { routerLink: 'subcont', icon: 'assignment', label: 'Sub Contracts' },
      { routerLink: 'po', icon: 'assignment', label: 'Purchase Order Entry' },
      {
        routerLink: 'styleevents',
        icon: 'assignment',
        label: 'Style-wise Events',
      },
      { routerLink: 'reports', icon: 'assignment', label: 'Reports' },
    ],
    tag: 'ordermanagement',
  },
  {
    routerLink: 'generalinventory',
    icon: '',
    label: 'General Inventory',
    subMenus: [
      {
        routerLink: 'srn',
        icon: 'assignment',
        label: 'Stores Requisition Note',
      },
      {
        routerLink: 'gin',
        icon: 'assignment',
        label: 'Goods Issue        Note',
      },
      {
        routerLink: 'grcn',
        icon: 'assignment',
        label: 'Goods Receive     Note',
      },
      {
        routerLink: 'grtn',
        icon: 'assignment',
        label: 'Goods Return      Note',
      },
      {
        routerLink: 'gtn',
        icon: 'assignment',
        label: 'Goods Transfer     Note',
      },
      {
        routerLink: 'srn',
        icon: 'assignment',
        label: 'Supplier Return    Note',
      },
      {
        routerLink: 'dgn',
        icon: 'assignment',
        label: 'Damaged Goods      Note',
      },
      {
        routerLink: 'ain',
        icon: 'assignment',
        label: 'Additional issue   Note',
      },
      {
        routerLink: 'dtn',
        icon: 'assignment',
        label: 'Direct Transfer    Note',
      },
      {
        routerLink: 'san',
        icon: 'assignment',
        label: 'Stock Adjustments  Note ',
      },
      {
        routerLink: 'reports',
        icon: 'report',
        label: 'Reports',
        subMenus: [
          {
            routerLink: 'srn',
            icon: 'report',
            label: 'Stock Valuation Report',
          },
          {
            routerLink: 'gin',
            icon: 'report',
            label: 'Stock Valuation Report(monthly)',
          },
          { routerLink: 'grcn', icon: 'report', label: 'Stock Status Report' },
          {
            routerLink: 'grtn',
            icon: 'report',
            label: 'Stock Movement (for an Item) ',
          },
          {
            routerLink: 'gtn',
            icon: 'report',
            label: 'Stock Movement (for an Order)',
          },
          { routerLink: 'srn', icon: 'report', label: 'List of Transactions' },
          {
            routerLink: 'dgn',
            icon: 'report',
            label: 'Item-wise Stock Balances',
          },
          {
            routerLink: 'ain',
            icon: 'report',
            label: 'Raw Material Control Sheet',
          },
          {
            routerLink: 'dtn',
            icon: 'report',
            label: 'Stock Summary Report - Basis wise',
          },
          { routerLink: 'san', icon: 'report', label: 'GRN Listings ' },
        ],
      },
    ],
  },
  {
    routerLink: 'orderwiseinventory',
    icon: '',
    label: 'Order Wise Inventory',
    subMenus: null,
    tag: 'orderwiseinventory',
  },
  {
    routerLink: 'productioncontrol',
    icon: '',
    label: 'Production Control',
    subMenus: [
      { routerLink: 'srn', icon: '', label: 'Daily Production Time Ticket' },
      { routerLink: 'srn', icon: '', label: 'Actual Production entry ' },
      { routerLink: 'srn', icon: '', label: 'Estimated Production entry' },
      { routerLink: 'srn', icon: '', label: 'Production Line Allocation' },
      { routerLink: 'srn', icon: '', label: 'Style wise Component Breakdown' },
      { routerLink: 'srn', icon: '', label: 'Style wise Operation Breakdown' },
      { routerLink: 'srn', icon: '', label: 'End of Production Confirmation' },
      { routerLink: 'srn', icon: '', label: 'Est. Prod. Line Allocation' },
    ],
    tag: 'productioncontrol',
  },
  {
    routerLink: 'quotaregister',
    icon: '',
    label: 'Quota register',
    subMenus: null,
    tag: 'quotaregister',
  },
  // {
  //   routerLink: 'importexportdoc',
  //   icon: '',
  //   label: 'Import/Export Documentation',
  //   subMenus: null,
  // },
  {
    routerLink: 'reports',
    icon: '',
    label: 'Reports',
    subMenus: null,
  },
  // { routerLink: 'aboutus', icon: '', label: 'About Us', subMenus: null },
  // { routerLink: 'contactus', icon: '', label: 'Contact Us', subMenus: null },
  // {
  //   routerLink:'profile', icon:'', label:'Profile',
  //   subMenus:[
  //       { routerLink:'settings', icon:'', label:'Settings'},
  //       { routerLink:'logout', icon:'', label:'Logout'}
  //   ]
  // },
];
