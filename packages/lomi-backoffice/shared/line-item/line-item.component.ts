import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lomii-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
})
export class LineItemComponent implements OnInit, AfterViewInit {

  @Input() lineItem:any;

  constructor() {}

  get totalItem(){
    return this.lineItem.quantity * this.lineItem.price
  }

  ngOnInit(): void {
    console.log(this.lineItem)
    return
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      const barsContainer = document.querySelector(".bars-"+this.lineItem.id);
      for (let i = 0; i < this.lineItem.quantity; i++){
        const bar = document.createElement('div');
        bar.classList.add("bar")
        bar.style.width = "100%"
        bar.style.height = "100%";
        if(this.lineItem.quantity == 1){  
          bar.style.borderRadius = "25px"
        } else if(!i){
          bar.style.borderRadius = "25px 25px 0 0"
        } else if(i == this.lineItem.quantity - 1){
          bar.style.borderRadius = "0 0 25px 25px"
        }
        bar.style.border = "1px solid white";
        bar.style["backgroundColor"] = "#00CCD9"
        barsContainer?.appendChild(
          bar
        )
      }

    },0)
  }
}
