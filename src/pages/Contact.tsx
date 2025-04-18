import React, { useState } from "react";
import RadioPlayer from "@/components/RadioPlayer";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, User, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { currentStation } = useAudioPlayer();
  
  const handleSearch = () => {
    // Search functionality if needed
  };

  const handleMenuClick = () => {
    // Menu handling can be implemented here if needed
    console.log("Menu clicked from Contact page");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message envoyé avec succès!");
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background">
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Contactez-nous</h2>
          
          <div className="bg-gowera-surface p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-muted/50 text-white border-0"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/50 text-white border-0"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-200">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="pl-10 bg-muted/50 text-white border-0 min-h-32"
                    placeholder="Votre message"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      {currentStation && <RadioPlayer />}
    </div>
  );
};

export default Contact;
