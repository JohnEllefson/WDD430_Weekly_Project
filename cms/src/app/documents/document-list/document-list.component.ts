import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    {
      id: 1,
      name: 'Sample Document 1',
      description: 'This is sample document 1 description.',
      url: 'https://example.com/sample-document1.pdf',
      children: []
    },
    {
      id: 2,
      name: 'Sample Document 2',
      description: 'This is sample document 2 description.',
      url: 'https://example.com/sample-document2.pdf',
      children: []
    },
    {
      id: 3,
      name: 'Sample Document 3',
      description: 'This is sample document 3 description.',
      url: 'https://example.com/sample-document3.pdf',
      children: []
    },
    {
      id: 4,
      name: 'Sample Document 4',
      description: 'This is sample document 4 description.',
      url: 'https://example.com/sample-document4.pdf',
      children: []
    },
    {
      id: 5,
      name: 'Sample Document 5',
      description: 'This is sample document 5 description.',
      url: 'https://example.com/sample-document5.pdf',
      children: []
    }
  ];

  onSelectDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
