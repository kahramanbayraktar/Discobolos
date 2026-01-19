import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Mail,
  Clock,
  Instagram,
  Twitter,
  Users,
  Heart,
  Trophy,
  HelpCircle,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Join Disc Dynasty Ultimate Frisbee team. Sign up for tryouts, get contact information, and learn how to become part of our community.",
};

const reasons = [
  {
    icon: Users,
    title: "Amazing Community",
    description:
      "Join a welcoming group of players who become lifelong friends.",
  },
  {
    icon: Heart,
    title: "Spirit of the Game",
    description: "Experience a sport built on respect, fairness, and joy.",
  },
  {
    icon: Trophy,
    title: "Competitive Play",
    description: "Participate in leagues, tournaments, and friendly matches.",
  },
];

const faqs = [
  {
    question: "Do I need experience to join?",
    answer:
      "Not at all! We welcome players of all skill levels, from complete beginners to experienced athletes. We have dedicated practice sessions for newer players and will help you learn the fundamentals.",
  },
  {
    question: "What equipment do I need?",
    answer:
      "Just bring yourself, comfortable athletic clothing, and cleats (soccer or football cleats work great). We provide discs for practice. Once you join the team, you'll get a team jersey.",
  },
  {
    question: "How often do you practice?",
    answer:
      "We have regular practices twice a week (Tuesday and Thursday evenings), with optional weekend scrimmages. You're not required to attend every session - we understand life gets busy!",
  },
  {
    question: "Is there a fee to join?",
    answer:
      "We have modest seasonal dues that cover field rentals, equipment, tournament fees, and team jerseys. We offer payment plans and never turn away players due to financial constraints.",
  },
  {
    question: "What's the time commitment?",
    answer:
      "As much or as little as you want! Casual players might attend 1-2 practices per week, while competitive players participate in tournaments and additional training. We're flexible!",
  },
  {
    question: "How do tryouts work?",
    answer:
      "We don't have traditional tryouts - instead, we invite you to join us for a few practices to see if the team is a good fit. It's low-pressure and focused on having fun!",
  },
];

export default function ContactPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Get Involved</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            Join the Dynasty
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Whether you're picking up a disc for the first time or you're a
            seasoned player looking for a new team, we'd love to have you join
            us!
          </p>
        </div>

        {/* Why Join Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {reasons.map((reason) => (
            <Card key={reason.title} className="text-center">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                  <reason.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {reason.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          {/* Contact Form */}
          <ContactForm />

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Practice Location</p>
                    <p className="text-sm text-muted-foreground">
                      Golden Gate Park, Field 3
                    </p>
                    <p className="text-sm text-muted-foreground">
                      San Francisco, CA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Practice Times</p>
                    <p className="text-sm text-muted-foreground">
                      Tuesday & Thursday: 6:00 PM - 8:00 PM
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Saturday (optional): 10:00 AM - 12:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email Us</p>
                    <a
                      href="mailto:hello@discdynasty.com"
                      className="text-sm text-primary hover:underline"
                    >
                      hello@discdynasty.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Follow us for updates, photos, and behind-the-scenes content!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section id="faq" className="max-w-3xl mx-auto scroll-mt-20">
          <div className="text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mt-2">
              Everything you need to know about joining Disc Dynasty
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
