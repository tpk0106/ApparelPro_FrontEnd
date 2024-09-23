import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() caption?: string;
  @Input() width!: number;
  @Input() onClick!: void;
  @Output() thisButtonClick: EventEmitter<MouseEvent> = new EventEmitter();

  public handleClick($event: MouseEvent) {
    this.thisButtonClick.emit($event);
  }
}

//https://www.develodesign.co.uk/learn/using-mouse-events-in-angular-v4-6
//https://angular.io/guide/component-interaction#parent-listens-for-child-event
