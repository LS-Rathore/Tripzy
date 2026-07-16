import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30"></div>
      
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-10 py-16 relative z-10">
        <div className="bento-card bg-white p-8 md:p-12 rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="inline-block bg-black text-white font-black px-3 py-1 rounded-lg transform -rotate-2 w-max shadow-lg mb-6 text-sm uppercase tracking-wide">
            Legal
          </div>
          
          <h1 className="font-display-lg text-4xl md:text-5xl font-black text-on-surface mb-8 leading-tight tracking-tight">
            Terms of Service
          </h1>
          
          <div className="space-y-8 text-on-surface-variant font-medium text-base leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using Tripzy, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-3">2. AI-Generated Content</h2>
              <p>Tripzy uses artificial intelligence to generate travel itineraries. While we strive for accuracy, we do not guarantee the completeness, reliability, or accuracy of the generated itineraries. Users should independently verify all travel details, including opening hours, visa requirements, and safety conditions.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-3">3. User Accounts</h2>
              <p>When you create an account with us, you must provide accurate information. You are responsible for safeguarding the password and for all activities that occur under your account.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-3">4. Limitation of Liability</h2>
              <p>Tripzy shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the service or any AI-generated itineraries.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
