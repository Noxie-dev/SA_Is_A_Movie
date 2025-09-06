import { motion } from "framer-motion";
import Layout from '../components/Layout';
import { Users, TrendingUp, Calendar, Heart, Target, Zap } from "lucide-react";

const AboutPage = () => {
  const stats = [
    { icon: Users, number: "500K+", label: "Followers" },
    { icon: TrendingUp, number: "1M+", label: "Monthly Views" },
    { icon: Calendar, number: "Daily", label: "Fresh Content" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Authentic Storytelling",
      description: "We tell real stories about real people, capturing the essence of South African culture with authenticity and respect."
    },
    {
      icon: Target,
      title: "Community Focus",
      description: "Our content is created by South Africans, for South Africans. We understand the local context and speak your language."
    },
    {
      icon: Zap,
      title: "Entertainment First",
      description: "While we inform, we never forget that entertainment is at our core. Life is too short for boring content!"
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
            <span className="text-[#FFA500]">About</span>
            <br />
            <span className="text-[#FF66B2]">SA IS A MOVIE</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#00FFFF] font-light mb-8">
            The Story Behind the Drama
          </p>
        </motion.div>
      </section>

      {/* Main About Content */}
      <section className="px-6 py-20 bg-[#0A0A2A]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
              Why SA IS A MOVIE?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Because South Africa is literally a movie! From the drama in parliament to the beats dropping 
              in the townships, from celebrity scandals to viral TikTok dances - we're here to capture it all. 
              We're not just reporting the news; we're telling the story of a nation that never stops entertaining.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mb-12">
              Our mission is simple: keep you in the loop with the most engaging, witty, and street-smart 
              coverage of everything that makes South Africa the most entertaining country on the continent. 
              We speak your language, we get your humor, and we're always ready with the perfect meme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
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
              Our Impact
            </h2>
            <p className="text-lg text-gray-300">
              Numbers that tell our story
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 mx-auto mb-4 saisa-text-yellow" />
                <div className="text-3xl font-bold saisa-text-yellow mb-2">{stat.number}</div>
                <div className="text-lg text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="text-lg text-gray-300">
              What drives us every day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg bg-[#1A1A3A]/50 border border-[#FFA500]/20"
              >
                <value.icon className="h-12 w-12 mx-auto mb-4 saisa-text-yellow" />
                <h3 className="text-xl font-bold mb-4 saisa-text-yellow">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-20 saisa-bg-dark">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 saisa-text-yellow text-shadow-neon">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              A passionate group of South Africans who live and breathe entertainment, 
              culture, and the stories that make our country unique.
            </p>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-400 leading-relaxed">
                Our team consists of journalists, content creators, social media experts, 
                and entertainment enthusiasts who are deeply connected to South African culture. 
                We're not just observers - we're participants in the stories we tell.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;