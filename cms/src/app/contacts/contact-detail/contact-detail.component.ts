import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  @Input() contact: Contact | null = null;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];

      // Case 1: contacts already loaded
      if (this.contactService.contacts.length > 0) {
        this.setContact(id);
      } else {
        // Case 2: wait for contact list to load
        this.contactService.contactListChangedEvent.subscribe(() => {
          this.setContact(id);
        });
      }
    });
  }

  private setContact(id: string) {
    this.contact = this.contactService.getContact(id);

    if (this.contact && (!this.contact.imageUrl || this.contact.imageUrl.trim() === '')) {
      this.contact.imageUrl = '../../assets/images/fredFlintstone.png';
    }
  }

  onDelete() {
    if (!this.contact) return;

    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }
}
