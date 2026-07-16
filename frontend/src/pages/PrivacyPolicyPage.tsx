import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          
          <div className="space-y-8 text-on-surface-variant font-medium text-base leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account (name, email) or use our trip planner (travel preferences, destinations, dates).</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-3">2. How We Use Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services. Specifically, your travel preferences are processed by our AI models to generate personalized itineraries.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-3">3. Information Sharing</h2>
              <p>We do not sell your personal information. We may share data with third-party vendors (like AI providers) strictly for the purpose of operating our service. These vendors are bound by confidentiality agreements.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-3">4. Data Security</h2>
              <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
