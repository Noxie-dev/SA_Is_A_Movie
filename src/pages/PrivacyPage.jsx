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
                <h2 className="text-2xl font-bold mb-4 saisa-text-yellow">Last Updated: {new Date().toLocaleDateString()}</h2>
                <p className="text-lg leading-relaxed">
                  At SA IS A MOVIE, we respect your privacy and are committed to protecting your personal information. 
                  This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Information We Collect</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal information you provide when subscribing to our newsletter</li>
                  <li>Comments and interactions on our content</li>
                  <li>Analytics data to improve our website performance</li>
                  <li>Social media interactions when you engage with our content</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">How We Use Your Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and improve our content and services</li>
                  <li>To send you newsletters and updates (with your consent)</li>
                  <li>To respond to your comments and inquiries</li>
                  <li>To analyze website usage and optimize user experience</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Information Sharing</h3>
                <p className="leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except as described in this policy or as required by law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Cookies and Tracking</h3>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, 
                  analyze site traffic, and understand where our visitors are coming from.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Your Rights</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Unsubscribe from our newsletters at any time</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt-out of certain data collection practices</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Data Security</h3>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 saisa-text-yellow">Contact Us</h3>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                  <br />
                  Email: privacy@saisamovie.co.za
                  <br />
                  Or visit our <a href="/contact" className="text-[#FFA500] hover:text-[#FF66B2] transition-colors">Contact Page</a>
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