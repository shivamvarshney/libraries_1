import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface PeriodicElement {
  image: any;
  aggregator_bvn_no: number;
  aggregator_name: string;
  account_no: number;
  Type: string;
  description: string;
}

@Component({
  selector: 'app-aggregator-mapping',
  templateUrl: './aggregator-mapping.component.html',
  styleUrls: ['./aggregator-mapping.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})  
export class AggregatorMappingComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['image','aggregator_bvn_no', 'aggregator_name', 'account_no', 'Type', 'actions'];
  // columnsToDisplay = [
  //   {'lable': 'image', 'title': 'image'},
  //   {'lable': 'aggregator_bvn_no', 'title': 'Aggregator BVN No'}, 
  //   {'lable': 'aggregator_name', 'title': 'Aggregator Name'}, 
  //   {'lable': 'account_no', 'title': 'Account no'}, 
  //   {'lable': 'type', 'title': 'Type'}, 
  //   {'lable': 'actions', 'title': 'Actions'}
  // ];
  expandedElement: PeriodicElement | null;
  constructor() { }
  ngOnInit() {
  }

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    image: "img",
    aggregator_bvn_no: 19898765786547546,
    aggregator_name: 'John Smith',
    account_no: 78988930984028934,
    Type: 'AEC',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    image: "img",
    aggregator_bvn_no: 29898765786547546,
    aggregator_name: 'John Smith',
    account_no: 78988930984028934,
    Type: 'AEC',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }, {
    image: "img",
    aggregator_bvn_no: 39898765786547546,
    aggregator_name: 'John Smith',
    account_no: 78988930984028934,
    Type: 'AEC',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    image: "img",
    aggregator_bvn_no: 49898765786547546,
    aggregator_name: 'John Smith',
    account_no: 78988930984028934,
    Type: 'AEC',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
  }, {
    image: "img",
    aggregator_bvn_no: 59898765786547546,
    aggregator_name: 'John Smith',
    account_no: 78988930984028934,
    Type: 'AEC',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`
  }
];

