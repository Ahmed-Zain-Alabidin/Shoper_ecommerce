import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly coreValues = [
    {
      icon: '🏆',
      title: 'Quality First',
      description:
        'We only curate products that meet our high standards. Every item is vetted for authenticity, durability, and value before it reaches your cart.',
    },
    {
      icon: '👥',
      title: 'Customer Centric',
      description:
        "Your experience is our priority, from browsing to delivery. We're here to ensure every interaction with Shoper exceeds your expectations.",
    },
    {
      icon: '⚡',
      title: 'Innovation',
      description:
        'Using modern tech (MERN Stack) to ensure a fast and secure store. We leverage cutting-edge technology to deliver a seamless shopping experience.',
    },
  ];
}
