import { motion } from "framer-motion";
import Layout from '../components/Layout';

const PrivacyPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-[#FFA500]">Privacy</span>
            <br />
            <span className="text-[#FF66B2]">Policy</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#00FFFF] font-light mb-8">
            Your Privacy Matters to Us
          </p>
        </motion.div>
      </section>

      {/* Privacy Policy Content */}
      <section className="px-6 py-20 bg-[#0A0A2A]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="text-gray-300 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 saisa-text-yellow">Last Updated: 6 September 2025</h2>
                <p className="text-lg leading-relaxed">
                  Welcome to SA_isaMovie. Your privacy matters to us. This Privacy Policy explains what personal and non‑personal data we collect, how we use it, where it's stored, and the choices and rights you have under South African law (POPIA) and applicable international privacy frameworks (for example, the EU General Data Protection Regulation — GDPR — where relevant).
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  If you have questions or want to exercise any of your rights, contact us at <strong className="text-[#FFA500]">privacy@sa_isamovie.co.za</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">1. Who we are</h3>
                <p className="leading-relaxed">
                  <strong>SA_isaMovie</strong> is an entertainment and news platform focused on trending South African stories. Our tech stack includes React + Vite + TailwindCSS + shadcn/ui on the frontend, a Node/Express placement and telemetry server, and PostgreSQL (via Drizzle ORM) for data storage. We use Google AdSense (ads) and analytics tooling to deliver and measure content and ad experiences.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">2. What data we collect</h3>
                <p className="leading-relaxed mb-4">We collect the following categories of information:</p>
                
                <h4 className="text-lg font-semibold mb-2 text-[#00FFFF]">a) Automatically collected technical & engagement data</h4>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Device and browser information (user agent, screen size, language).</li>
                  <li>Connection and network data (IP address, approximate location derived from IP, referrer).</li>
                  <li>Page and session metrics (page views, timestamps, session start/end).</li>
                  <li>Interaction events collected <strong>only with user consent</strong>: scroll depth, time on section, section enter/exit, visibility (tab focus), clicks on page elements, and other anonymous engagement events. These are recorded using a lightweight frontend event queue and sent to our server in batched form.</li>
                  <li>Diagnostic and error logs.</li>
                </ul>

                <h4 className="text-lg font-semibold mb-2 text-[#00FFFF]">b) Ad and decision data</h4>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Ad placement decisions returned by our Placement Decision API (variant metadata), impressions, and click events (ad-level metrics). We do not collect financial transaction data.</li>
                </ul>

                <h4 className="text-lg font-semibold mb-2 text-[#00FFFF]">c) Voluntarily provided information</h4>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Email addresses or messages you send us via contact or newsletter sign‑up forms. We store these only if you provide them.</li>
                </ul>

                <h4 className="text-lg font-semibold mb-2 text-[#00FFFF]">d) Cookies and similar technologies</h4>
                <p className="leading-relaxed">
                  We use cookies and browser storage for session management, preferences, analytics, and advertising. See section <strong>Cookies & Tracking</strong> below for details.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">3. Legal basis for processing</h3>
                <p className="leading-relaxed mb-4">
                  Under POPIA, GDPR and similar laws, we rely on one or more of the following lawful bases to process data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Consent:</strong> for analytics, personalization, and non‑essential tracking. We will obtain consent prior to collecting engagement events or enabling personalised advertising where required.</li>
                  <li><strong>Legitimate interests:</strong> for fraud prevention, site security, debugging, and to operate and improve the site (balanced against user rights and freedoms).</li>
                  <li><strong>Contract / service provision:</strong> to provide services that you request (for example, subscription to a newsletter).</li>
                  <li><strong>Legal obligations:</strong> where we must retain or disclose data to comply with applicable law.</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  We will ask for clear consent where required by law (for example, for personalised advertising in certain jurisdictions).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">4. How we use your data</h3>
                <p className="leading-relaxed mb-4">We use data to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Deliver and optimise the reading experience on SA_isaMovie.</li>
                  <li>Decide where to show ads and which ad formats are most appropriate using our Placement Decision API.</li>
                  <li>Measure content and ad performance (e.g., impressions, viewability, CTR, RPM proxies).</li>
                  <li>Prevent fraud and abuse and protect the site's integrity.</li>
                  <li>Send you transactional messages and newsletters if you opt in.</li>
                  <li>Comply with legal obligations and respond to lawful requests.</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  We do <strong>not</strong> sell your personal information to third parties.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">5. Cookies & Tracking</h3>
                <p className="leading-relaxed mb-4">We use the following types of cookies / storage:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential cookies:</strong> required for site operation (session id, load balancing).</li>
                  <li><strong>Analytics cookies:</strong> to understand usage patterns (e.g., whether content sections are being read).</li>
                  <li><strong>Advertising cookies:</strong> used by third parties (Google AdSense) and our own decision engine to help choose ad variants and measure ad performance.</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  You can manage cookie preferences via our consent banner and through your browser settings. For advertising preferences you may also control settings via Google Ad Settings (for personalised ads) and opt out of some third‑party ad tracking via browser or device controls.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">6. Third parties and data sharing</h3>
                <p className="leading-relaxed mb-4">
                  We use trusted third‑party providers to operate the site and serve ads and analytics, including (but not limited to):
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google AdSense</strong> — for ad serving and measurement; Google may process identifiers, cookies and usage data.</li>
                  <li><strong>Analytics tooling</strong> (self-hosted or third-party like PostHog) — for heatmaps, session analytics, and events processing.</li>
                  <li>Cloud and hosting providers that store and process the server‑side data (e.g., deploying the Node/Express server, database hosting).</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  When we share data with third parties, we require appropriate contracts and security measures. Some third parties may process data outside South Africa — where that occurs we put in place standard contractual clauses or other safeguards to protect your information.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">7. Retention and anonymisation</h3>
                <p className="leading-relaxed mb-4">
                  We retain data only as long as necessary for the purposes described, and we apply the following default rules unless otherwise required by law:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Raw engagement events (session traces): retained for <strong>180 days</strong>, after which raw traces are deleted or irreversibly aggregated.</li>
                  <li>Aggregated analytics and reporting: retained indefinitely in anonymised/aggregated form for trend analysis and product improvements.</li>
                  <li>Contact form and newsletter emails: retained until you request deletion or unsubscribe; backups may be retained for a reasonable administrative period.</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  If you request deletion of your personal data, we will take reasonable steps to delete associated records within a commercially reasonable timeframe and to the extent permitted by law and contractual obligations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">8. Your rights</h3>
                <p className="leading-relaxed mb-4">
                  Depending on your jurisdiction you have rights to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal data we hold about you.</li>
                  <li>Request correction of inaccurate personal data.</li>
                  <li>Request deletion or restriction of processing (subject to legal limits).</li>
                  <li>Object to processing that is based on legitimate interests.</li>
                  <li>Withdraw consent at any time (without affecting the lawfulness of prior processing).</li>
                  <li>Where applicable, request data portability.</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  To exercise these rights, contact <strong className="text-[#FFA500]">privacy@sa_isamovie.co.za</strong>. We will verify identity before fulfilling requests and respond within the statutory timelines that apply in your jurisdiction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">9. Security</h3>
                <p className="leading-relaxed">
                  We implement industry‑standard technical and organisational measures to protect data, including HTTPS/TLS for data in transit, access controls, and regular security patching. While we strive to protect your information, no system is completely secure; if a data breach occurs we will comply with legal obligations and notify affected individuals and supervisory authorities as required by law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">10. Children</h3>
                <p className="leading-relaxed">
                  SA_isaMovie is not intended for children under the age required by local law to provide consent (under POPIA and other laws this age may vary). We do not knowingly collect personal information from children. If you believe we have inadvertently collected personal data from a child, contact us at <strong className="text-[#FFA500]">privacy@sa_isamovie.co.za</strong> and we will remove it as soon as possible.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">11. Cross‑border data transfers</h3>
                <p className="leading-relaxed">
                  Some of our service providers (e.g., Google, analytics providers or cloud hosts) may process data outside South Africa. Where data is transferred internationally we will ensure there are appropriate safeguards in place — contractual clauses, certified providers, or other lawful transfer mechanisms.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">12. How to opt out of tracking and personalised ads</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use our consent banner to turn off non‑essential tracking.</li>
                  <li>Disable cookies via your browser settings.</li>
                  <li>For Google personalised ads, visit Google Ad Settings or use the Ads Settings controls in your device/browser.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">13. Changes to this policy</h3>
                <p className="leading-relaxed">
                  We may update this policy from time to time. When we do we will post the updated policy here with a new "Last updated" date. For material changes, we will provide more prominent notice.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">14. Contact & complaints</h3>
                <p className="leading-relaxed">
                  If you have questions, privacy requests, or complaints, contact us at:
                </p>
                <p className="leading-relaxed mt-2">
                  <strong>Email:</strong> <span className="text-[#FFA500]">privacy@sa_isamovie.co.za</span>
                </p>
                <p className="leading-relaxed mt-4">
                  If we cannot resolve your complaint you may have the right to escalate to the Information Regulator in South Africa or other relevant supervisory authority depending on your jurisdiction.
                </p>
              </div>

              <div className="border-t border-gray-600 pt-6 mt-8">
                <p className="text-sm text-gray-400 italic">
                  <strong>Disclaimer:</strong> This Privacy Policy is provided for informational purposes only and does not constitute legal advice. For formal legal guidance about POPIA, GDPR or other privacy obligations, consult a qualified attorney.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage;