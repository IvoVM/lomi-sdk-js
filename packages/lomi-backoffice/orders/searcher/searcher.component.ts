import { Component, OnInit } from '@angular/core';
import { SearcherService } from 'packages/lomi-backoffice/src/app/orders/searcher.service';

@Component({
  selector: 'lomii-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit {
  constructor(
    public searcherService: SearcherService
  ) {}

  public search(event:any){
    const queryString = event.target.value
    this.searcherService.search(queryString)
  }

  ngOnInit(): void {}
}
