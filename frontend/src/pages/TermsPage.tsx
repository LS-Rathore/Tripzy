import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30"></div>
      
      <Navbar />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 py-10 relative z-10">
        <div className="bento-card bg-white p-6 md:p-8 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="inline-block bg-black text-white font-black px-3 py-1 rounded-lg transform -rotate-2 w-max shadow-md mb-4 text-xs uppercase tracking-wide">
            Legal
          </div>
          
          <h1 className="font-display-lg text-3xl md:text-4xl font-black text-on-surface mb-6 leading-tight tracking-tight">
            Terms of Service
          </h1>
          
          <div className="space-y-6 text-on-surface-variant font-medium text-sm leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="font-display-lg text-xl font-black text-on-surface mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using Tripzy, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-xl font-black text-on-surface mb-2">2. AI-Generated Content</h2>
              <p>Tripzy uses artificial intelligence to generate travel itineraries. While we strive for accuracy, we do not guarantee the completeness, reliability, or accuracy of the generated itineraries. Users should independently verify all travel details, including opening hours, visa requirements, and safety conditions.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-xl font-black text-on-surface mb-2">3. User Accounts</h2>
              <p>When you create an account with us, you must provide accurate information. You are responsible for safeguarding the password and for all activities that occur under your account.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-xl font-black text-on-surface mb-2">4. Limitation of Liability</h2>
              <p>Tripzy shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the service or any AI-generated itineraries.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
