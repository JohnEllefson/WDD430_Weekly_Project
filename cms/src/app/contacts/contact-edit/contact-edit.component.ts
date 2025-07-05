import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode = false;
  id: string;
  invalidGroupContactDropped = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id);
      if (!this.originalContact) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.originalContact.group && Array.isArray(this.originalContact.group)) {
        this.groupContacts = this.originalContact.group.map((contact) =>
          JSON.parse(JSON.stringify(contact))
        );
      }
    });
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) return true;
    if (this.contact && newContact.id === this.contact.id) return true;
    return this.groupContacts.some((c) => c.id === newContact.id);
  }

  addToGroup(event: CdkDragDrop<any>) {
    console.log('DROP EVENT:', event);

    const selectedContact: Contact = event.item.data;

    if (this.isInvalidContact(selectedContact)) {
      this.invalidGroupContactDropped = true;
      setTimeout(() => {
        this.invalidGroupContactDropped = false;
      }, 3000); // hide after 3 seconds
      return;
    }

    this.groupContacts.push(selectedContact);
    this.invalidGroupContactDropped = false;
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) return;
    this.groupContacts.splice(index, 1);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      (this.contactService.getMaxId() + 1).toString(),
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    if (this.editMode) {
      newContact.id = this.originalContact.id; // preserve the original ID
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts']);
  }
}
