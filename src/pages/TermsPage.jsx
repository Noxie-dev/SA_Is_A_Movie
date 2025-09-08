import { motion } from "framer-motion";
import Layout from '../components/Layout';

const TermsPage = () => {
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
            <span className="text-[#FFA500]">Terms of</span>
            <br />
            <span className="text-[#FF66B2]">Service</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#00FFFF] font-light mb-8">
            Please Read These Terms Carefully
          </p>
        </motion.div>
      </section>

      {/* Terms of Service Content */}
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
                <h2 className="text-2xl font-bold mb-4 saisa-text-yellow">Last Updated: {new Date().toLocaleDateString()}</h2>
                <p className="text-lg leading-relaxed">
                  Welcome to SA IS A MOVIE! These Terms of Service ("Terms") govern your use of our website 
                  and services. By accessing or using our site, you agree to be bound by these Terms.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Acceptance of Terms</h3>
                <p className="leading-relaxed">
                  By using this site, you confirm you are at least 13 years old and agree to these Terms. 
                  If you do not agree, please discontinue use immediately. By accessing and using this website, 
                  you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Use License</h3>
                <p className="leading-relaxed mb-3">
                  Permission is granted to temporarily download one copy of the materials on SA IS A MOVIE's website 
                  for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">User Conduct</h3>
                <p className="leading-relaxed mb-3">
                  You agree to use our website in a manner that is lawful and respectful. You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Post or transmit any unlawful, threatening, defamatory, or obscene content</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Interfere with or disrupt the website or servers</li>
                  <li>Use automated systems to access the website without permission</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Content and Intellectual Property</h3>
                <p className="leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, is the property 
                  of SA IS A MOVIE and is protected by copyright and other intellectual property laws. You may not 
                  reproduce, distribute, or create derivative works without our written permission.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Data Protection & Privacy</h3>
                <p className="leading-relaxed mb-3">
                  We collect data in accordance with POPIA, GDPR, and our <a href="/privacy" className="text-[#FFA500] hover:text-[#FF66B2] transition-colors">Privacy Policy</a>. 
                  By using our website, you consent to analytics, engagement tracking, and personalised advertising unless you opt out using our cookie preferences banner.
                </p>
                <p className="leading-relaxed">
                  SA IS A MOVIE uses Google AdSense, GA4, and third-party analytics to personalise ads and measure engagement. 
                  We share anonymised data with these providers in line with our <a href="/privacy" className="text-[#FFA500] hover:text-[#FF66B2] transition-colors">Privacy Policy</a>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">User Rights (POPIA & GDPR)</h3>
                <p className="leading-relaxed">
                  You have the right to access, correct, request deletion, or restrict processing of your personal information. 
                  Contact <a href="mailto:privacy@saisamovie.co.za" className="text-[#FFA500] hover:text-[#FF66B2] transition-colors">privacy@saisamovie.co.za</a> to exercise these rights.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Children's Privacy</h3>
                <p className="leading-relaxed">
                  SA IS A MOVIE does not knowingly collect data from children under 13. If you believe we have inadvertently 
                  collected such data, please contact us to delete it.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Disclaimer</h3>
                <p className="leading-relaxed">
                  The materials on SA IS A MOVIE's website are provided on an 'as is' basis. SA IS A MOVIE makes no 
                  warranties, expressed or implied, and hereby disclaims and negates all other warranties including 
                  without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
                  or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Limitation of Liability</h3>
                <p className="leading-relaxed">
                  We are not responsible for damages, loss of profits, or data due to reliance on our services. 
                  You use this platform at your own risk. In no event shall SA IS A MOVIE or its suppliers be liable for any damages 
                  (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                  to use the materials on SA IS A MOVIE's website, even if SA IS A MOVIE or a SA IS A MOVIE authorized 
                  representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Governing Law</h3>
                <p className="leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of South Africa 
                  and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Changes to Terms</h3>
                <p className="leading-relaxed">
                  We may update these Terms to reflect changes in law or business operations. Continued use of the site after updates implies acceptance. 
                  SA IS A MOVIE reserves the right to revise these terms of service at any time without notice. 
                  By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Contact Information</h3>
                <p className="leading-relaxed">
                  Questions about these Terms? Contact:
                  <br />Email: legal@saisamovie.co.za
                  <br />Visit our <a href="/contact" className="text-[#FFA500] hover:text-[#FF66B2] transition-colors">Contact Page</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;