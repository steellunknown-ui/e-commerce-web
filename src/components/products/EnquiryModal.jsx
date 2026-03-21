import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function EnquiryModal({ isOpen, onClose, product }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Supabase submission ready structure
    alert("Enquiry Submitted Successfully! (Future Supabase Integration)");
    onClose();
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
              <Input id="name" placeholder="John Doe" required className="bg-muted/10 border-muted/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@company.com" required className="bg-muted/10 border-muted/30" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone / WhatsApp</Label>
              <Input id="phone" placeholder="+91 98765 43210" required className="bg-muted/10 border-muted/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City / Country</Label>
              <Input id="location" placeholder="New Delhi, India" required className="bg-muted/10 border-muted/30" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Estimated Quantity (MOQ: {product?.moq || 'Variable'})</Label>
            <Input id="quantity" placeholder="e.g., 500 Kg or 100 Units" required className="bg-muted/10 border-muted/30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Requirements / Message</Label>
            <Textarea id="message" placeholder="Include specifics about packaging, destination ports, or custom requests." rows={4} className="bg-muted/10 border-muted/30" />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose} className="border border-muted/30">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Submit Enquiry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
