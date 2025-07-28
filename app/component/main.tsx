'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Code, Globe, Cog, ArrowRight, Menu, X, Users, Award, Clock, Star, ExternalLink } from 'lucide-react';
import ContactForm from './ContactForm';
import Image from 'next/image';
import Logo from "../../public/Logo.png";
import { url } from 'inspector';
import { image } from 'framer-motion/client';
// Animated Background Components
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
};

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + 100) % 100,
        y: (particle.y + particle.speedY + 100) % 100,
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transition: 'all 0.1s linear',
          }}
        />
      ))}
    </div>
  );
};

const GeometricShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated Circles */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-white/10 rounded-full animate-spin-slow"></div>
      <div className="absolute top-40 right-20 w-24 h-24 border border-white/5 rounded-full animate-bounce-slow"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 border border-white/8 rounded-full animate-pulse-slow"></div>
      
      {/* Animated Squares */}
      <div className="absolute top-60 right-40 w-16 h-16 border border-white/10 rotate-45 animate-float"></div>
      <div className="absolute bottom-60 right-10 w-20 h-20 border border-white/5 rotate-12 animate-float-delayed"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-orb"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-orb-delayed"></div>
    </div>
  );
};

const GridBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'grid-move 20s linear infinite'
      }}>
      </div>
    </div>
  );
};

const Main = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeProjectType, setActiveProjectType] = useState('web');
  
  type SectionKey = 'home' | 'about' | 'stats' | 'services' | 'projects' | 'contact';
  const [isVisible, setIsVisible] = useState({
    home: false,
    about: false,
    stats: false,
    services: false,
    projects: false,
    contact: false
  });
  const [footerDropdowns, setFooterDropdowns] = useState({
    services: false,
    quickLinks: false
  });
  
  const statsRef = useRef(null);
  const [counters, setCounters] = useState({
    clients: 0,
    projects: 0,
    experience: 0,
    satisfaction: 0
  });

  const stats = [
    { icon: <Users className="w-8 h-8" />, label: "Happy Clients", value: 50, suffix: "+" },
    { icon: <Award className="w-8 h-8" />, label: "Projects Completed", value: 70, suffix: "+" },
    { icon: <Clock className="w-8 h-8" />, label: "Years Experience", value: 3, suffix: "+" },
    { icon: <Star className="w-8 h-8" />, label: "Client Satisfaction", value: 98, suffix: "%" }
  ];

  // Animation counter effect
interface CounterState {
    clients: number;
    projects: number;
    experience: number;
    satisfaction: number;
}

type CounterKey = keyof CounterState;

interface AnimateCounterOptions {
    target: number;
    key: CounterKey;
    duration?: number;
}

const animateCounter = (
    target: number,
    key: CounterKey,
    duration: number = 2000
): void => {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            setCounters((prev: CounterState) => ({ ...prev, [key]: Math.floor(start) }));
            requestAnimationFrame(updateCounter);
        } else {
            setCounters((prev: CounterState) => ({ ...prev, [key]: target }));
        }
    };

    updateCounter();
};

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [id]: true }));
            
            // Trigger counter animations when stats section becomes visible
            if (id === 'stats' && !isVisible['stats']) {
              setTimeout(() => animateCounter(150, 'clients'), 200);
              setTimeout(() => animateCounter(200, 'projects'), 400);
              setTimeout(() => animateCounter(5, 'experience'), 600);
              setTimeout(() => animateCounter(98, 'satisfaction'), 800);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isVisible]);

  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Web Development Services",
      description: "We build cutting-edge web solutions and dashboard designs using the latest technologies in web development. From SaaS platforms to portfolio websites, we create modern, scalable solutions.",
      features: ["Web Solutions & Dashboards", "SaaS Platform Building", "Portfolio Websites", "Latest Web Technologies", "Responsive Design", "Modern UI/UX"]
    },
    {
      icon: <Cog className="w-8 h-8" />,
      title: "Automation Services",
      description: "We automate any repetitive work using N8N and Python, helping many businesses streamline their operations and eliminate manual tasks for maximum efficiency.",
      features: ["N8N Workflow Automation", "Python Script Development", "Business Process Automation", "Repetitive Task Elimination", "Custom Integrations", "Operational Efficiency"]
    }
  ];

  const webProjects = [
    {
      title: "Saleor Storefront",
      url: "https://storefront.saleor.io/default-channel",
      image: ".png",
      description: "A production-ready eCommerce storefront powered by Next.js and integrated with Saleor's GraphQL API.",
      tech: ["Next.js", "React", "Node.js", "Stripe", "Tailwind"],
      features: ["User Management", "Subscription Billing", "Advanced Analytics", "Real-time Features"]
    },
    {
      title: "Hashnode Clone",
      url: "https://hashnode-clone-iota.vercel.app/",
      description: "The hassle-free blogging platform for engineers, thought-leaders, and the dev community!",
       image: ".png",
      tech: ["PostgreSQL", "D3.js", "Tailwind", "Framer Motion", "Next.js"],
      features: ["Data Visualization", "Real-time Updates", "Custom Analytics", "Responsive Design"]
    },
    {
      title: "OpenResume",
      url: "https://www.open-resume.com/",
      description: "A sleek, customizable resume builder built with Next.js, Tailwind CSS, TypeScript, and PDF rendering using React PDF.",
      image: ".png",
      tech: ["Next.js", "Tailwind", "Framer Motion", "Zustand", "React PDF"],
      features: ["Modern Design", "SEO Optimized", "Fast Loading", "Content Management"]
    },
      {
      title: "Portfolio Websites",
      url: "https://portfolio-six-iota-97.vercel.app/",
      description: "Modern, responsive portfolio websites showcasing your work with the latest web technologies and best practices.",
      image: ".png",
      tech: ["Next.js", "Tailwind", "Framer Motion", "CMS"],
      features: ["Modern Design", "SEO Optimized", "Advanced Analytics", "Content Management"]
    }
  ];

  const automationProjects = [
    {
      title: "N8N Workflow Automation",
       url: "",
      description: "Custom N8N workflows that automate complex business processes, integrate multiple platforms, and eliminate repetitive tasks.",
      tech: ["N8N", "APIs", "Webhooks", "Cloud"],
      features: ["Multi-platform Integration", "Custom Workflows", "Automated Triggers", "Real-time Processing"]
    },
    {
      title: "Python Business Automation",

      url: "",
      description: "Python-based automation scripts for data processing, report generation, and business process optimization.",
      tech: ["Python", "Pandas", "APIs", "Databases"],
      features: ["Data Processing", "Report Generation", "Task Scheduling", "Database Integration"]
    },
    {
      title: "Enterprise Process Automation",
      url: "",
      description: "End-to-end automation solutions that help businesses eliminate manual work and increase operational efficiency.",
      tech: ["Python", "N8N", "REST APIs", "Cloud Services"],
      features: ["Process Optimization", "Cost Reduction", "Error Elimination", "Scalable Solutions"]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
    setFooterDropdowns({ services: false, quickLinks: false });
  };

  const toggleFooterDropdown = (dropdown: 'services' | 'quickLinks') => {
    setFooterDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-30px) rotate(45deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-25px) rotate(12deg); }
        }
        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0, 0); }
          25% { transform: scale(1.1) translate(20px, -20px); }
          50% { transform: scale(0.9) translate(-20px, 20px); }
          75% { transform: scale(1.05) translate(15px, 15px); }
        }
        @keyframes orb-delayed {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(0.8) translate(-30px, 30px); }
          66% { transform: scale(1.2) translate(30px, -15px); }
        }
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite 2s; }
        .animate-orb { animation: orb 15s ease-in-out infinite; }
        .animate-orb-delayed { animation: orb-delayed 18s ease-in-out infinite 3s; }
      `}</style>

      {/* Background Animations */}
      <FloatingParticles />
      <GeometricShapes />
      <GridBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="w-16">
             <Image src={Logo} alt='Logo'/>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'services', 'projects', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-all duration-300 hover:scale-110 text-sm ${
                    activeSection === item ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden hover:scale-110 transition-transform duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
              {['home', 'about', 'services', 'projects', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left capitalize text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative" data-animate>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible['home'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              We Build
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 animate-pulse">
                Digital Solutions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Professional web development and automation services
              that transform your business vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              >
                View Our Work
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-900/20 to-gray-900/40 relative" data-animate>
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Us</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We are a team of passionate developers dedicated to transforming businesses through digital innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 delay-200 ${
              isVisible['about'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                Who We Are
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                We are a dedicated team of passionate developers and digital innovators who believe in the power of technology to transform businesses. Our mission is to help companies digitalize their operations and streamline their workflows for maximum efficiency.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                With years of experience in web development and automation, we understand the challenges businesses face in today's digital landscape. That's why we create tailored solutions that not only save time and money but also drive growth and innovation.
              
              </p>
            </div>

            {/* Right Content */}
            <div className={`transition-all duration-1000 delay-400 ${
              isVisible['about'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                How We Help Your Business
              </h3>
              
              <div className="space-y-6">
                <div >
        
                  <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                    Automate repetitive tasks and streamline workflows to free up valuable time for strategic business activities.
                  </p>
                </div>

                <div>
                
                  <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                    Reduce operational costs through efficient digital solutions and automated processes that eliminate manual work.
                  </p>
                </div>

                <div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                    Implement scalable web solutions and automation systems that support business expansion and improve customer experience.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section id="stats" className="py-20 relative" data-animate>
        <div className="container mx-auto px-6">
          <div className={`transition-all duration-1000 delay-200 ${
            isVisible['stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center  transition-all duration-500 transform hover:scale-105  group ${
                    isVisible['stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200 + 400}ms` }}
                >
                  <div className="text-white mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-40">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.label === "Happy Clients" ? counters.clients : 
                     stat.label === "Projects Completed" ? counters.projects :
                     stat.label === "Years Experience" ? counters.experience :
                     counters.satisfaction}
                    <span className="text-gray-300">{stat.suffix}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-900/30 to-gray-900/50 relative" data-animate>
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible['services'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We specialize in creating cutting-edge web development solutions and powerful automation systems
              that drive business growth and operational efficiency.
            </p>
          </div>

          {/* Main Services */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10 ${
                  isVisible['services'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 300 + 200}ms` }}
              >
                <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 max-w-md mx-auto">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-gray-400 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* Projects Section */}
<section id="projects" className="py-20 relative" data-animate>
  <div className="container mx-auto px-6">
    <div className={`text-center mb-16 transition-all duration-1000 ${
      isVisible['projects'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Projects</h2>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Explore our showcase of web development and automation solutions that have transformed businesses.
      </p>
    </div>

    {/* Toggle Section for Projects */}
    <div className={`text-center mb-12 transition-all duration-1000 delay-200 ${
      isVisible['projects'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-full p-2 border border-white/10">
        <button
          onClick={() => setActiveProjectType('web')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
            activeProjectType === 'web'
              ? 'bg-white text-black shadow-lg'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Globe className="w-5 h-5" />
          Web Projects
        </button>
        <button
          onClick={() => setActiveProjectType('automation')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
            activeProjectType === 'automation'
              ? 'bg-white text-black shadow-lg'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Cog className="w-5 h-5" />
          Automation Projects
        </button>
      </div>
    </div>

    {/* Dynamic Projects Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {(activeProjectType === 'web' ? webProjects : automationProjects).map((project, index) => (
        <div
          key={index}
          className={`p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 group transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10 ${
            isVisible['projects'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: `${index * 200 + 400}ms` }}
        >
          <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300">
            {activeProjectType === 'web' ? <Globe className="w-8 h-8" /> : <Cog className="w-8 h-8" />}
          </div>
          <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
          <p className="text-gray-300 mb-6 leading-relaxed">
            {project.description}
          </p>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Key Features:</h4>
            <ul className="space-y-2">
              {project.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="text-gray-400 flex items-center gap-2 text-sm"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Demo Link Button */}
          {project.url && (
            <div className="mt-6 pt-6 border-t">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-2 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group"
              >
                <span>View Demo</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
    <ContactForm/>

      {/* Footer */}
      <footer className="py-9 bg-gradient-to-b from-transparent to-gray-900/50 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="w-20  flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">

              <Image src={Logo} alt='Logo'/>
      
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                We build cutting-edge web solutions and automation systems that transform your business vision into digital reality.
              </p>
              <div className="space-y-2">
                <p className="text-gray-300 hover:text-white transition-colors duration-300">
                  triomind@gmail.com
                </p>
                <p className="text-gray-300 hover:text-white transition-colors duration-300">
                 +213 656-404-460
                </p>
              </div>
            </div>

            {/* Services */}
            <div>
              {/* Desktop View */}
              <div className="hidden md:block">
                <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
                <ul className="space-y-3">
                  <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300">Web Development</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300">SaaS Platforms</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300">Automation</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300">Dashboard Design</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300">Portfolio Websites</a></li>
                </ul>
              </div>

              {/* Mobile View with Dropdown */}
              <div className="md:hidden">
                <button
                  onClick={() => toggleFooterDropdown('services')}
                  className="flex items-center justify-between w-full text-white font-semibold text-lg mb-2 hover:text-gray-300 transition-colors duration-300"
                >
                  Services
                  <ChevronDown className={`w-5 h-5 transform transition-transform duration-300 ${footerDropdowns.services ? 'rotate-180' : ''}`} />
                </button>
                {footerDropdowns.services && (
                  <ul className="space-y-3 pl-4 border-l border-white/20">
                    <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300 block">Web Development</a></li>
                    <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300 block">SaaS Platforms</a></li>
                    <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300 block">Automation</a></li>
                    <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300 block">Dashboard Design</a></li>
                    <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300 block">Portfolio Websites</a></li>
                  </ul>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              {/* Desktop View */}
              <div className="hidden md:block">
                <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors duration-300">Home</button></li>
                  <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors duration-300">Services</button></li>
                  <li><button onClick={() => scrollToSection('projects')} className="text-gray-400 hover:text-white transition-colors duration-300">Projects</button></li>
                  <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors duration-300">Contact</button></li>
                </ul>
              </div>

              {/* Mobile View with Dropdown */}
              <div className="md:hidden">
                <button
                  onClick={() => toggleFooterDropdown('quickLinks')}
                  className="flex items-center justify-between w-full text-white font-semibold text-lg mb-2 hover:text-gray-300 transition-colors duration-300"
                >
                  Quick Links
                  <ChevronDown className={`w-5 h-5 transform transition-transform duration-300 ${footerDropdowns.quickLinks ? 'rotate-180' : ''}`} />
                </button>
                {footerDropdowns.quickLinks && (
                  <ul className="space-y-3 pl-4 border-l border-white/20">
                    <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors duration-300 block text-left">Home</button></li>
                    <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors duration-300 block text-left">Services</button></li>
                    <li><button onClick={() => scrollToSection('projects')} className="text-gray-400 hover:text-white transition-colors duration-300 block text-left">Projects</button></li>
                    <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors duration-300 block text-left">Contact</button></li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; 2025 TrioMind Agency. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Main;
