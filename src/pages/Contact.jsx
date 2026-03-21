import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent. We will contact you back soon!");
  };

  return (
    <div className="pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Get In Touch</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground">We’d Love to Hear From You</h1>
          <p className="text-foreground/60 leading-relaxed">Have a question about our products, certification, or bulk logistics? Reach out directly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Information */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-serif text-xl font-bold mb-4">Contact Information</h3>
            
            <div className="flex items-start space-x-4 p-4 border border-muted/10 rounded-xl bg-card">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold text-sm">Call / WhatsApp</h4>
                <p className="text-xs text-foreground/60">+91-8976461365</p>
                <p className="text-xs text-foreground/60 mt-1">+91-9029506324</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-muted/10 rounded-xl bg-card">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold text-sm">Email Address</h4>
                <p className="text-xs text-foreground/60">greenweave345@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-muted/10 rounded-xl bg-card">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold text-sm">Our Address</h4>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  04, A11, Kalher, Kalher, Bhiwandi, Thane, Maharashtra - 421302, India
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white border border-muted/20 rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-2 mb-6 text-primary">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-serif text-xl font-bold text-foreground">Send a Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="contact-name">Your Name</Label>
                  <Input id="contact-name" placeholder="John Doe" required className="bg-muted/5 border-muted/30" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contact-email">Email Address</Label>
                  <Input id="contact-email" type="email" placeholder="name@company.com" required className="bg-muted/5 border-muted/30" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input id="contact-subject" placeholder="Bulk Inquiry / General Question" required className="bg-muted/5 border-muted/30" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea id="contact-message" placeholder="Include as much detail as possible..." rows={5} className="bg-muted/5 border-muted/30" />
              </div>

              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white w-full h-11 font-semibold">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
