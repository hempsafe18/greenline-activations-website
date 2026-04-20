import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Greenline Activations — how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section">
      <div className="container-lg max-w-3xl">
        <h1 className="text-4xl font-bold text-dark mb-2">Privacy Policy</h1>
        <p className="text-sm font-body text-gray-400 mb-10">Last updated: April 2025</p>

        <div className="prose-styles space-y-10">

          <Block title="1. Overview">
            <p>Greenline Activations (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website located at greenlineactivations.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our services. Please read this policy carefully. If you disagree with its terms, please discontinue use of the site.</p>
          </Block>

          <Block title="2. Information We Collect">
            <p>We may collect the following categories of personal information:</p>
            <ul>
              <li><strong>Contact information:</strong> name, email address, phone number</li>
              <li><strong>Application data:</strong> Florida market, ambassador experience, availability, and any information you voluntarily provide in application forms</li>
              <li><strong>Usage data:</strong> IP address, browser type, pages visited, time spent on pages, and referring URLs collected automatically via analytics tools</li>
              <li><strong>Communications:</strong> records of email, SMS, or form-based communications with us</li>
            </ul>
          </Block>

          <Block title="3. How We Collect Information">
            <p>We collect information through:</p>
            <ul>
              <li>Forms submitted on our website (ambassador application, lead magnet requests, scheduling)</li>
              <li>HubSpot CRM and marketing platform, which tracks page visits and form submissions</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Direct communications (email, phone, SMS)</li>
            </ul>
          </Block>

          <Block title="4. How We Use Your Information">
            <p>We use collected information to:</p>
            <ul>
              <li>Process brand ambassador applications and onboard qualified candidates</li>
              <li>Schedule and communicate about activation events and assignments</li>
              <li>Send operational communications including activation reminders, schedule updates, and program information</li>
              <li>Send SMS messages to opted-in ambassadors and contacts (see Section 6)</li>
              <li>Deliver requested resources such as the Florida Retail Activation Checklist</li>
              <li>Respond to inquiries and schedule introductory calls</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Block>

          <Block title="5. Sharing of Information">
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul>
              <li><strong>HubSpot:</strong> our CRM and marketing automation platform</li>
              <li><strong>Service providers:</strong> third-party vendors who assist in operating our website and delivering our services, bound by confidentiality obligations</li>
              <li><strong>Legal authorities:</strong> when required by law, subpoena, or to protect the rights and safety of our company or others</li>
            </ul>
          </Block>

          <Block title="6. SMS Communications">
            <p>By providing your phone number and consenting to receive SMS messages — whether through an application form, opt-in, or direct agreement — you agree to receive text messages from Greenline Activations including:</p>
            <ul>
              <li>Activation event reminders and scheduling updates</li>
              <li>Operational notifications related to your ambassador assignments</li>
              <li>Program updates and announcements</li>
            </ul>
            <p><strong>Message frequency:</strong> Message frequency varies. You may receive up to several messages per week depending on your active assignment schedule.</p>
            <p><strong>Message and data rates:</strong> Message and data rates may apply depending on your mobile carrier and plan.</p>
            <p><strong>Opt-out:</strong> You may opt out of SMS communications at any time by replying <strong>STOP</strong> to any message. After opting out, you will receive a single confirmation message and no further SMS will be sent. To re-subscribe, reply <strong>START</strong>.</p>
            <p><strong>Help:</strong> For assistance, reply <strong>HELP</strong> to any SMS or contact us at hello@greenlineactivations.com.</p>
            <p>We do not use SMS for unsolicited marketing. SMS is used solely for operational communications with opted-in ambassadors and contacts.</p>
          </Block>

          <Block title="7. Cookies and Tracking">
            <p>We use cookies and similar technologies to improve your browsing experience and analyze site traffic. HubSpot places tracking cookies to identify returning visitors and attribute form submissions. You may disable cookies in your browser settings; however, some features of the site may not function properly if you do so.</p>
          </Block>

          <Block title="8. Data Retention">
            <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, maintain our business records, and comply with legal obligations. Ambassador applicants who are not selected may have their information retained for up to 24 months for future consideration.</p>
          </Block>

          <Block title="9. Your Rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
            <p>To exercise these rights, contact us at hello@greenlineactivations.com.</p>
          </Block>

          <Block title="10. Children's Privacy">
            <p>Our services are not directed to individuals under the age of 21. We do not knowingly collect personal information from anyone under 21. If we become aware that we have collected such information, we will delete it promptly.</p>
          </Block>

          <Block title="11. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the &quot;Last updated&quot; date at the top of this page. Continued use of our website after changes constitutes acceptance of the updated policy.</p>
          </Block>

          <Block title="12. Contact Us">
            <p>If you have questions about this Privacy Policy or your personal information, contact us at:</p>
            <p className="mt-2">
              <strong>Greenline Activations</strong><br />
              Email: hello@greenlineactivations.com<br />
              Website: greenlineactivations.com
            </p>
          </Block>

        </div>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-sans font-bold text-dark mb-3">{title}</h2>
      <div className="font-body text-gray-600 text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-dark">
        {children}
      </div>
    </div>
  );
}
