import { EventEmitter } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-microphone-container',
  templateUrl: './microphone-container.component.html',
  styleUrls: ['./microphone-container.component.scss']
})
export class MicrophoneContainerComponent implements OnInit{
  @Output() voice: EventEmitter<any> = new EventEmitter();
  @ViewChild('canvasEl') canvasEl: any;

  val = 0
  frequencyArr = (new Array(100)).fill(0)
  diff = (new Array(100)).fill(0)

  sd(array: number[]) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }

  mean(array) {
    return array.reduce((a, b) => a + b) / array.length
  }

  normalization(arr) {
    const sd = this.sd(arr)
    const mean = this.mean(arr)
    if(!sd) return (new Array(100)).fill(0)
    return arr.map(v => (v - mean)/ sd)
  }

  constructor(
    public cd: ChangeDetectorRef
  ) {}

  ngOnInit() {

  }

  show() {
    let minGain = 100;
    window.onload =  () => {

    };

    const soundAllowed =  (stream) => {
      (window as any).persistAudioStream = stream;
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const audioStream = audioCtx.createMediaStreamSource(stream);
      const audioAnalyser = audioCtx.createAnalyser();
      audioStream.connect(audioAnalyser);
      audioAnalyser.fftSize = 256;
      const frequencyArray = new Uint8Array(audioAnalyser.frequencyBinCount);

      let val = 0
      const listening =  () => {
        let gaining = 0;
        audioAnalyser.getByteFrequencyData(frequencyArray);

        val++
        if (val%2 === 0 ) {
          this.diff = [...frequencyArray].map((v, i) => Math.abs(this.frequencyArr[i] - v))
          this.voice.emit(this.normalization(this.frequencyArr.slice(0, 100)))
          this.frequencyArr = [...frequencyArray]
        }
        frequencyArray.forEach((f) => {
          if (f > minGain) {
            gaining++;
          }
        });

        requestAnimationFrame(listening);
      };
      listening();
    };

    async function getMedia(pc) {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        soundAllowed(stream);
      } catch (err) {
        console.log(err);
      }
    }
    getMedia(undefined);
  }
}
