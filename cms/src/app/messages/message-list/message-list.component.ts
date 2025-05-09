import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(1, 'Test Message 1', 'This is a test message number 1.', 'John Doe'),
    new Message(2, 'Test Message 2', 'This is a test message number 2.', 'Alice Johnson'),
    new Message(3, 'Test Message 3', 'This is a test message number 3.', 'Bob Smith'),
    new Message(4, 'Test Message 4', 'This is a test message number 4.', 'Jimmy Bowman'),
    new Message(5, 'Test Message 5', 'This is a test message number 5.', 'Lilly Johnson'),
    new Message(6, 'Test Message 6', 'This is a test message number 6.', 'Willard Carter')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
