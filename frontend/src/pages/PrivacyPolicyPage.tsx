import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-on-surface-variant font-medium text-sm leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="font-display-lg text-xl font-black text-on-surface mb-2">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account (name, email) or use our trip planner (travel preferences, destinations, dates).</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-xl font-black text-on-surface mb-2">2. How We Use Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services. Specifically, your travel preferences are processed by our AI models to generate personalized itineraries.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-xl font-black text-on-surface mb-2">3. Information Sharing</h2>
              <p>We do not sell your personal information. We may share data with third-party vendors (like AI providers) strictly for the purpose of operating our service. These vendors are bound by confidentiality agreements.</p>
            </section>
            
            <section>
              <h2 className="font-display-lg text-xl font-black text-on-surface mb-2">4. Data Security</h2>
              <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
