import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { supabase } from "@/lib/supabase";
import emailjs from '@emailjs/browser';

export default function EnquiryModal({ isOpen, onClose, product }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Read directly from form naming
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from('enquiries').insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.location, 
        product_name: product ? product.name : "Bulk Enquiry",
        quantity: data.quantity,
        message: data.message
      }]);

      if (error) throw error;

      // 📧 Send Email via EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(serviceId, templateId, {
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            location: data.location,
            product: product ? product.name : "Bulk Enquiry",
            quantity: data.quantity,
            message: data.message
          }, publicKey);
        } catch (emailErr) {
          console.warn("Email notification failed to send:", emailErr);
        }
      }

      alert("Enquiry Submitted Successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit enquiry: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border border-muted/20">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-bold text-foreground">
            {product ? `Enquire about ${product.name}` : 'Bulk Enquiry & Quotation'}
          </DialogTitle>
          <DialogDescription className="text-foreground/60">
            Please fill in your details and requirements. Our team will get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="bg-muted/10 border-muted/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@company.com" required className="bg-muted/10 border-muted/30" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone / WhatsApp</Label>
              <Input id="phone" name="phone" placeholder="+91 98765 43210" required className="bg-muted/10 border-muted/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City / Country</Label>
              <Input id="location" name="location" placeholder="New Delhi, India" required className="bg-muted/10 border-muted/30" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Estimated Quantity (MOQ: {product?.moq || 'Variable'})</Label>
            <Input id="quantity" name="quantity" placeholder="e.g., 500 Kg or 100 Units" required className="bg-muted/10 border-muted/30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Requirements / Message</Label>
            <Textarea id="message" name="message" placeholder="Include specifics about packaging, destination ports, or custom requests." rows={4} className="bg-muted/10 border-muted/30" />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:flex-row flex-col">
            <Button 
              type="button" 
              variant="outline" 
              className="border-emerald-600/50 text-emerald-700 hover:bg-emerald-50 flex-1 h-10"
              onClick={() => {
                const number = import.meta.env.VITE_WHATSAPP_NUMBER || "918976461365"; // fallback from contact
                const message = product 
                  ? `Hi, I am interested in inquiring about ${product.name}.`
                  : `Hi, I have a general bulk inquiry/quotation request.`;
                window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
              }}
            >
              WhatsApp Enquiry
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="ghost" onClick={onClose} className="border border-muted/30 flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white flex-1">
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
