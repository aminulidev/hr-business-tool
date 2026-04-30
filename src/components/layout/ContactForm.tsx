'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setIsSubmitted(true);
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="pt-10 pb-10 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription className="text-base text-foreground/80">
            Your message has been sent successfully. We aim to respond to all inquiries within 48 business hours.
          </CardDescription>
          <Button 
            variant="outline" 
            onClick={() => setIsSubmitted(false)}
            className="mt-4 border-emerald-600/20 hover:bg-emerald-500/10 text-emerald-700"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-lg shadow-emerald-500/5">
      <CardHeader>
        <CardTitle className="text-xl">Send us a Message</CardTitle>
        <CardDescription>
          Fill out the form below and we&apos;ll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required className="bg-background/50 border-border/50 focus-visible:ring-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Your email address" required className="bg-background/50 border-border/50 focus-visible:ring-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="How can we help?" required className="bg-background/50 border-border/50 focus-visible:ring-emerald-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              name="message"
              placeholder="Tell us more about your inquiry..." 
              required 
              className="min-h-[120px] bg-background/50 border-border/50 focus-visible:ring-emerald-500" 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
