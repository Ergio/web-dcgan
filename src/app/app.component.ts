import { Component, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
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

  x = -1
  y = -1
  changeX(v: any) {
    this.x = v.value
    console.log(v)
    this.run([this.x/this.CONST_VAL, this.y/this.CONST_VAL])
  }
  changeY(v: any) {
    this.y = v.value
    console.log(v)
    this.run([this.x/this.CONST_VAL, this.y/this.CONST_VAL])
  }

  constructor() {}

  ngOnInit() {
    this.model = tf.loadGraphModel(
      'assets/files/model.json');
    this.run([this.x/this.CONST_VAL, this.y/this.CONST_VAL])
  }



  formatLabel(value: number) {

    return value / 100;
  }


  async run(arr: any) {
    console.log(arr)
    const val = tf.tensor([arr])//tf.ones([1,2])
    this.model.then(v => {
      const tensor = v.predict(val) as any
      const value = tensor.dataSync()
      this.createImg(value.map((v: any) => v + 1))
    })
}


 createImg(predictedValue) {
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
