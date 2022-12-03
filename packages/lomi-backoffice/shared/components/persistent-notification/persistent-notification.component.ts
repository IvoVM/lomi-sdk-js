import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lomii-persistent-notification',
  templateUrl: './persistent-notification.component.html',
  styleUrls: ['./persistent-notification.component.scss'],
})
export class PersistentNotificationComponent implements OnInit {  
  public audio:HTMLAudioElement = new Audio();
  public interval:any;
  public closed = false;

  playAudio(){
    this.audio.load();
    this.audio.play();
  }

  muteAudio(){
    this.audio.volume = 0;
  }

  unmuteAudio(){
    this.audio.volume = 0.2;
  }

  constructor() {
    this.audio.src = "/assets/audio/cabify_near.wav";
    this.audio.volume = 0.2
    this.playAudio()
  }

  stopAudio(){
    this.closed = true;
    clearInterval(this.interval)
  }

  ngOnDestroy(){
    //this.audio.volume = 0;
    clearInterval(this.interval)
  }

  ngOnInit(): void {
    this.interval = setInterval(()=>{
      this.playAudio()
    },3000)
  }
}
