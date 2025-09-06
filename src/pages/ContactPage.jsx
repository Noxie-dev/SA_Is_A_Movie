import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, Send } from "lucide-react";
import Layout from '../components/Layout';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch for collaborations, tips, or just to say hi!",
      contact: "hello@saisamovie.co.za",
      action: "mailto:hello@saisamovie.co.za"
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Based in the heart of South Africa",
      contact: "Johannesburg, South Africa",
      action: null
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "For urgent matters or media inquiries",
      contact: "+27 11 123 4567",
      action: "tel:+27111234567"
    }
  ];

  const socialLinks = [
    {
      icon: Instagram,
      name: "Instagram",
      handle: "@saisamovie",
      url: "https://instagram.com/saisamovie",
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      icon: Twitter,
      name: "Twitter",
      handle: "@saisamovie",
      url: "https://twitter.com/saisamovie",
      color: "bg-gradient-to-r from-blue-400 to-blue-600"
    },
    {
      icon: Facebook,
      name: "Facebook",
      handle: "SA IS A MOVIE",
      url: "https://facebook.com/saisamovie",
      color: "bg-gradient-to-r from-blue-600 to-blue-800"
    }
  ];

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
            <span className="text-[#FFA500]">Get In</span>
            <br />
            <span className="text-[#FF66B2]">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#00FFFF] font-light mb-8">
            Let's Connect and Create Magic Together
          </p>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 py-20 bg-[#0A0A2A]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Send Us a Message
            </h2>
            <p className="text-lg text-gray-300">
              Have a story tip, collaboration idea, or just want to chat? We'd love to hear from you!
            </p>
          </motion.div>

          <Card className="bg-[#1A1A3A]/50 border-[#FFA500]/20">
            <CardHeader>
              <CardTitle className="text-2xl saisa-text-yellow text-center">Contact Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <Input 
                    placeholder="Your name" 
                    className="bg-[#0A0A2A] border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="bg-[#0A0A2A] border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <Input 
                  placeholder="What's this about?" 
                  className="bg-[#0A0A2A] border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us what's on your mind..." 
                  rows={6}
                  className="bg-[#0A0A2A] border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500]"
                />
              </div>
              <div className="text-center">
                <Button className="saisa-bg-red text-white px-8 py-3 rounded-xl font-bold red-glow hover:scale-105 transition-all duration-300">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-6 py-20 saisa-bg">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 saisa-text-yellow">
              Other Ways to Reach Us
            </h2>
            <p className="text-lg text-gray-300">
              Choose the method that works best for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg bg-[#1A1A3A]/50 border border-[#FFA500]/20"
              >
                <info.icon className="h-12 w-12 mx-auto mb-4 saisa-text-yellow" />
                <h3 className="text-xl font-bold mb-2 saisa-text-yellow">{info.title}</h3>
                <p className="text-gray-300 mb-4">{info.description}</p>
                {info.action ? (
                  <a 
                    href={info.action}
                    className="text-[#FFA500] hover:text-[#FF66B2] transition-colors font-medium"
                  >
                    {info.contact}
                  </a>
                ) : (
                  <p className="text-[#FFA500] font-medium">{info.contact}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="px-6 py-20 bg-[#0A0A2A]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Follow Us on Social Media
            </h2>
            <p className="text-lg text-gray-300">
              Stay connected and be part of the conversation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {socialLinks.map((social, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 rounded-lg bg-[#1A1A3A]/50 border border-[#FFA500]/20 hover:border-[#FFA500] transition-all duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${social.color} flex items-center justify-center`}>
                    <social.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 saisa-text-yellow">{social.name}</h3>
                  <p className="text-gray-300">{social.handle}</p>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 py-20 saisa-bg-dark">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 saisa-text-yellow text-shadow-neon">
              Stay in the Loop
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest scandals, events, and hot takes delivered straight to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A2A] border border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500] focus:outline-none"
              />
              <Button className="saisa-bg-red text-white px-6 py-3 rounded-xl font-bold red-glow hover:scale-105 transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;