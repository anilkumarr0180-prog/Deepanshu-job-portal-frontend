import type { HeadquartersInfo, OfficeColumnGroup } from "../types/contact.types";

export const HEADQUARTERS: HeadquartersInfo = {
  name: "JobBox Corporation",
  addressLines: [
    "205 North Michigan Avenue, Suite 810",
    "Chicago, 60601, USA",
  ],
  phone: "(123) 456-7890",
  email: "contact@jobbox.com",
  mapUrl: "https://maps.google.com/?q=205+North+Michigan+Avenue+Suite+810+Chicago+60601+USA",
};

export const OFFICE_COLUMNS: OfficeColumnGroup[] = [
  {
    id: "col-1",
    offices: [
      {
        city: "London",
        address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      },
      {
        city: "New York",
        address: "4517 Washington Ave. Manchester, Kentucky 39495",
      },
    ],
  },
  {
    id: "col-2",
    offices: [
      {
        city: "Chicago",
        address: "3891 Ranchview Dr. Richardson, California 62639",
      },
      {
        city: "San Francisco",
        address: "4140 Parker Rd. Allentown, New Mexico 31134",
      },
    ],
  },
  {
    id: "col-3",
    offices: [
      {
        city: "Sysney",
        address: "3891 Ranchview Dr. Richardson, California 62639",
      },
      {
        city: "Singapore",
        address: "4140 Parker Rd. Allentown, New Mexico 31134",
      },
    ],
  },
];
