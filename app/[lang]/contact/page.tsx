import { ContactForm } from "@/components/contact/contact-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import {
  Clock,
  Heart,
  HelpCircle,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Trophy,
  Users
} from "lucide-react";
import type { Metadata } from "next";

interface ContactPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: `${dict.contact_page.title} | Discobolos`,
    description: dict.contact_page.description,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const reasons = [
    {
      icon: Users,
      title: dict.contact_page.reasons.community.title,
      description: dict.contact_page.reasons.community.description,
    },
    {
      icon: Heart,
      title: dict.contact_page.reasons.spirit.title,
      description: dict.contact_page.reasons.spirit.description,
    },
    {
      icon: Trophy,
      title: dict.contact_page.reasons.competitive.title,
      description: dict.contact_page.reasons.competitive.description,
    },
  ];

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">{dict.contact_page.badge}</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            {dict.contact_page.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {dict.contact_page.description}
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
          <ContactForm dict={dict.contact_form} />

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{dict.contact_page.contact_info_title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dict.contact_page.practice_location_title}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {dict.contact_page.practice_location_desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dict.contact_page.practice_times_title}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {dict.contact_page.practice_times_desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dict.contact_page.email_us_title}</p>
                    <a
                      href="mailto:bodrumdiscobolos@gmail.com"
                      className="text-sm text-primary hover:underline"
                    >
                      bodrumdiscobolos@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{dict.contact_page.follow_us_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/disc.o.bolos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {dict.contact_page.follow_us_desc}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  {dict.contact_page.whatsapp_title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {dict.contact_page.whatsapp_desc}
                </p>
                <a
                  href="https://chat.whatsapp.com/I6e3ebUCedM7bqaI7vK4aj" // Placeholder link, user can update
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full"
                >
                  {dict.contact_page.whatsapp_button}
                </a>
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
              {dict.contact_page.faq_title}
            </h2>
            <p className="text-muted-foreground mt-2">
              {dict.contact_page.faq_desc}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {dict.contact_page.faqs.map((faq: any, index: number) => (
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
