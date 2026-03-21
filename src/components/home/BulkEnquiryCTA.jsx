import { useState } from 'react';
import { Button } from '@/components/ui/button';
import EnquiryModal from '@/components/products/EnquiryModal';

export default function BulkEnquiryCTA() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="font-semibold text-sm uppercase tracking-wider text-white/80">B2B & Export Enquiries</span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold">Interested in Bulk Orders or Wholeness Supply?</h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          We support bulk customized packaging, private labeling, and direct-to-port logistics for global partners. Get a quotation today.
        </p>
        <div className="pt-4">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl hover:shadow-2xl transition-all duration-300"
            onClick={() => setIsOpen(true)}
          >
            Request Quotation / Enquire Now
          </Button>
        </div>
      </div>

      <EnquiryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
}
