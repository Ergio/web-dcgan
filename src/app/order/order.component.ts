import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  @Output() changeOrder: EventEmitter<any> = new EventEmitter() as any
  @Input() data = []
  @Input() dataView = []


  makeFirst(el) {
    this.data.unshift(el)
    this.data = this.data.splice(0,100)
  }
  compare(a, b) {
    return a < b
  }

  changeVal(e, i) {
    this.data[e.target.value] = this.data[i]

    this.data[i] = `${e.target.value}`


    // this.data = [...this.data]s
    this.changeOrder.emit(this.data)
  }
}
