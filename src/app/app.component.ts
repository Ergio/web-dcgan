import { Component, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { randomNormal } from '@tensorflow/tfjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('canvasEl') canvasEl: any;
  title = 'neural-app';
  model: any;

  CONST_VAL = 100

  constructor() {}

  ngOnInit() {
    this.model = tf.loadGraphModel(
      'assets/files/model.json');
    // this.run((new Array(100)).fill(1).map(v => Math.random()))
    // this.recursive()

    // console.log(this.arr)
    // this.run(this.arr)
    this.recursive()
  }
  

  ind = 0
  difArr = Array.from(randomNormal([1, 100]).dataSync())
  arr = Array.from(randomNormal([1, 100]).dataSync())
  recursive() {
    this.ind++
    this.arr = this.arr.map((v, i) => v + this.difArr[i]*0.1)
    if (this.ind % 10 === 0) {
      const newArr = (Array.from(randomNormal([1, 100]).dataSync()))
      this.difArr =  this.arr.map((v, i) => {
        return newArr[i] - v
      })
    }

    setTimeout(() => {
      this.run(this.arr)
      this.recursive()
    }, 50)
  }



  formatLabel(value: number) {

    return value / 100;
  }


  async run(arr: any) {
    const val = tf.tensor([arr])//tf.ones([1,2])
    console.log(val)
    this.model.then(v => {
      const tensor = v.predict(val) as any
      const value = tensor.dataSync()
      this.createImg(value.map((v: any) => v ))
    })
}


 createImg(predictedValue) {
   console.log('createImg')
    var canvas=this.canvasEl.nativeElement;
    var ctx=canvas.getContext("2d");
    canvas.width=256;
    canvas.height=256;
    var imgData=ctx.getImageData(0,0,256,256);
    var data=imgData.data;
    for(var i=0;i<data.length;i+=4){
        data[i+3]= 255 -predictedValue[i/4]*255;
    }
    ctx.putImageData(imgData,0,0);
    var image=new Image();
    image.src=canvas.toDataURL();
  }
}
