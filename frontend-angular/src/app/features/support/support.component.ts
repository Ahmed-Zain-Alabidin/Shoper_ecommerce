import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './support.component.html',
})
export class SupportComponent {
  readonly expandedFaq = signal<number | null>(null);

  form = { name: '', email: '', subject: '', message: '' };
  readonly submitted = signal(false);

  readonly categories = [
    {
      icon: '📦',
      title: 'Order Tracking',
      description: 'Where is my Shoper package?',
    },
    {
      icon: '🔄',
      title: 'Returns & Refunds',
      description: 'Our policy and how to start a return.',
    },
    {
      icon: '💳',
      title: 'Payment & Pricing',
      description: 'Methods we accept and billing issues.',
    },
    {
      icon: '👤',
      title: 'Account Help',
      description: 'Managing your profile and security.',
    },
  ];

  readonly faqs = [
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping typically takes 3-5 business days within Egypt. Express shipping is available for 1-2 business day delivery.',
    },
    {
      question: 'Can I change my order after placing it?',
      answer:
        'You can modify or cancel your order within 1 hour of placement. After that, please contact our support team.',
    },
    {
      question: "What is Shoper's return period?",
      answer:
        'We offer a 30-day return period for most items. Products must be unused and in original packaging.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept Visa, Mastercard, PayPal, and cash on delivery (COD) for orders within Egypt.',
    },
    {
      question: 'How do I track my order?',
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track orders by logging into your account.",
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Currently, we only ship within Egypt. International shipping will be available soon.',
    },
  ];

  toggleFaq(index: number): void {
    this.expandedFaq.update((v) => (v === index ? null : index));
  }

  handleSubmit(): void {
    this.submitted.set(true);
    this.form = { name: '', email: '', subject: '', message: '' };
    setTimeout(() => this.submitted.set(false), 4000);
  }
}
