import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lomii-persistent-notification',
  templateUrl: './persistent-notification.component.html',
  styleUrls: ['./persistent-notification.component.scss'],
})
export class PersistentNotificationComponent implements OnInit {  

  @Input() title = "El repartidor esta esperando el pedido fuera de la tienda";
  @Input() journey: any;
  @Input() order: any;
  @Input() cssColor = "green";

  public audio:HTMLAudioElement = new Audio();
  public interval:any;
  public closed = false;

  public timesPlayed = 0;

  playAudio(){
    if(!this.order && !this.journey){
      return
    }
    const alarmMuted = localStorage.getItem(this.order ? "muteAlarm#"+this.order.number : "muteAlarm#"+this.journey.orderNumber)
    if(alarmMuted && new Date().getTime() - parseInt(alarmMuted) < 1000*3*5){
      this.muteAudio()
      return
    } else if(alarmMuted && new Date().getTime() - parseInt(alarmMuted) > 1000*60*5) {
      localStorage.removeItem(this.order ? "muteAlarm#"+this.order.number : "muteAlarm#"+this.journey.orderNumber)
      this.unmuteAudio()
      this.timesPlayed = 0;
    }

    if(this.timesPlayed == 5){
      this.muteAudio()
      localStorage.setItem(this.order? "muteAlarm#"+this.order.number : "muteAlarm#"+this.journey.orderNumber, new Date().getTime().toString())
    }
    this.audio.load();
    this.audio.play();
    this.timesPlayed++;
  }

  muteAudio(){
    this.audio.volume = 0;
  }

  unmuteAudio(){
    this.audio.volume = 1;
  }

  chooseSoundBasedOnTitle(){
    switch(this.title){
      case "El repartidor esta esperando el pedido fuera de la tienda" : return "cabify_near.wav";
      default: return "new_order.wav"
    }
  }

  constructor() {

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
    this.audio.src = "/assets/audio/"+this.chooseSoundBasedOnTitle();
    this.audio.volume = 1
    this.playAudio()
    this.interval = setInterval(()=>{
      this.playAudio()
    },3000)
  }
}
