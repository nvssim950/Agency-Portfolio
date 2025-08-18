import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

interface SubmitStatus {
  type: 'success' | 'error';
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [isVisible, setIsVisible] = useState(true); // For demo purposes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare data in the format your API expects
      const apiData = {
        name: formData.name,
        email: formData.email,
        subject: `${formData.service} - ${formData.company}`, 
        message: `Company: ${formData.company}\nService: ${formData.service}\n\nMessage:\n${formData.message}`
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you within 24 hours.' });
        setFormData({ name: '', email: '', company: '', service: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message' });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-t from-black to-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Work Together</h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Ready to transform your ideas into powerful digital solutions?
              Get in touch and let's discuss your project.
            </p>
          </div>

          <div className={`p-8 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h3 className="text-2xl font-bold mb-4 text-white">Send us a Message</h3>
            <p className="text-gray-400 mb-6">
              Prefer to write? Send us your project details and we'll get back to you within 24 hours.
            </p>

            {/* Status Message */}
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg border ${
                submitStatus.type === 'success' 
                  ? 'bg-green-900/40 border-green-600/50 text-green-300' 
                  : 'bg-red-900/40 border-red-600/50 text-red-300'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <div className="space-y-4">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-gray-800 transition-all duration-300 focus:scale-105"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-gray-800 transition-all duration-300 focus:scale-105"
                />
              </div>

              {/* Company Name */}
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-gray-800 transition-all duration-300 focus:scale-105"
              />

              {/* Service Selection */}
              <select 
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-gray-500 focus:bg-gray-800 transition-all duration-300 focus:scale-105"
              >
                <option value="" className="bg-gray-800 text-gray-400">Select Service</option>
                <option value="Web Development" className="bg-gray-800 text-white">Web Development</option>
                <option value="Automation" className="bg-gray-800 text-white">Automation</option>
                <option value="All Services" className="bg-gray-800 text-white">All Services</option>
              </select>

              {/* Message */}
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project requirements..."
                required
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-gray-800 transition-all duration-300 resize-none focus:scale-105"
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full px-6 py-4 border border-gray-600/50 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed bg-gray-800/50 text-white' 
                    : 'text-white hover:bg-gray-800/50 hover:border-gray-500 transform hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
