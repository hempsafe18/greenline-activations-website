import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for use of the Greenline Activations website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <section className="section">
      <div className="container-lg max-w-3xl">
        <h1 className="text-4xl font-bold text-dark mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm font-body text-gray-400 mb-10">Last updated: April 2025</p>

        <div className="space-y-10">

          <Block title="1. Acceptance of Terms">
            <p>By accessing or using the Greenline Activations website at greenlineactivations.com (&quot;Site&quot;), you agree to be bound by these Terms &amp; Conditions and our Privacy Policy. If you do not agree, please do not use the Site. These terms apply to all visitors, users, and others who access or use the Site.</p>
          </Block>

          <Block title="2. About Greenline Activations">
            <p>Greenline Activations provides field marketing, brand ambassador management, retail activation, and related services for hemp and functional beverage brands in Florida. Use of this Site does not constitute a service agreement. A formal engagement requires a separate written agreement between Greenline Activations and the client.</p>
          </Block>

          <Block title="3. Use of the Site">
            <p>You agree to use this Site only for lawful purposes and in a manner that does not infringe the rights of others. You may not:</p>
            <ul>
              <li>Use the Site in any way that violates applicable federal, state, or local laws</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its related systems</li>
              <li>Transmit any unsolicited or unauthorized advertising or promotional material</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
              <li>Scrape, crawl, or harvest data from the Site without written permission</li>
            </ul>
          </Block>

          <Block title="4. Ambassador Applications">
            <p>Submitting a brand ambassador application through our Site does not guarantee employment, engagement, or activation assignments. Greenline Activations reserves the right to accept or decline any application at its sole discretion. Applicants must be 21 years of age or older and located in or willing to work in Florida.</p>
            <p>By submitting an application, you confirm that the information provided is accurate and complete. Providing false or misleading information may result in disqualification or termination of any existing engagement.</p>
          </Block>

          <Block title="5. SMS Terms and Conditions">
            <p>By providing your phone number on any form on this Site and checking an opt-in box (or otherwise consenting in writing), you agree to receive text messages (SMS) from Greenline Activations.</p>

            <p><strong>Program description:</strong> SMS messages are used for operational communications including activation event reminders, schedule updates, assignment notifications, and program announcements for brand ambassadors and opted-in contacts.</p>

            <p><strong>Who sends the messages:</strong> Messages are sent by Greenline Activations. Shortcodes or long codes may be used depending on the platform in use at the time of messaging.</p>

            <p><strong>Message frequency:</strong> Message frequency varies based on activation schedules and program activity. You may receive up to several messages per week during active assignment periods.</p>

            <p><strong>Message and data rates:</strong> Standard message and data rates may apply. Check with your mobile carrier for details on your plan.</p>

            <p><strong>Consent is not a condition of purchase:</strong> You are not required to consent to receive SMS messages as a condition of purchasing any goods or services.</p>

            <p><strong>How to opt out:</strong> Reply <strong>STOP</strong> to any SMS message at any time to unsubscribe. You will receive one final confirmation message. No further messages will be sent after opting out. To re-subscribe, reply <strong>START</strong>.</p>

            <p><strong>Help:</strong> For help, reply <strong>HELP</strong> to any SMS message or email hello@greenlineactivations.com.</p>

            <p><strong>Supported carriers:</strong> SMS is available on most major U.S. carriers. Greenline Activations is not liable for delayed or undelivered messages.</p>

            <p><strong>Privacy:</strong> We do not share your phone number with third parties for their own marketing purposes. See our Privacy Policy for full details.</p>
          </Block>

          <Block title="6. Intellectual Property">
            <p>All content on this Site — including text, graphics, logos, images, and software — is the property of Greenline Activations or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on this Site without express written permission.</p>
          </Block>

          <Block title="7. Disclaimer of Warranties">
            <p>This Site and its content are provided &quot;as is&quot; and &quot;as available&quot; without warranty of any kind, express or implied. Greenline Activations does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. We make no guarantees regarding the accuracy or completeness of any information on the Site, including ROI calculator outputs, which are estimates only and do not constitute financial advice.</p>
          </Block>

          <Block title="8. Limitation of Liability">
            <p>To the fullest extent permitted by law, Greenline Activations shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this Site or its content, even if we have been advised of the possibility of such damages. Our total liability to you for any claim arising from use of this Site shall not exceed $100.</p>
          </Block>

          <Block title="9. Third-Party Links">
            <p>This Site may contain links to third-party websites including HubSpot, HempSafe, and others. These links are provided for convenience only. Greenline Activations does not endorse and is not responsible for the content, privacy practices, or accuracy of any third-party site. Accessing third-party sites is at your own risk.</p>
          </Block>

          <Block title="10. Hemp and Cannabis Compliance">
            <p>Greenline Activations operates exclusively with hemp-derived products legal under the 2018 Farm Bill and applicable Florida law. Nothing on this Site constitutes legal or regulatory advice. Brands and ambassadors are responsible for ensuring their own compliance with all applicable federal, state, and local laws governing hemp, CBD, and functional beverage products.</p>
          </Block>

          <Block title="11. Governing Law">
            <p>These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Site shall be resolved in the state or federal courts located in Florida.</p>
          </Block>

          <Block title="12. Changes to These Terms">
            <p>We reserve the right to modify these Terms &amp; Conditions at any time. Changes are effective immediately upon posting to the Site. Your continued use of the Site after any changes constitutes acceptance of the new terms. We encourage you to review this page periodically.</p>
          </Block>

          <Block title="13. Contact Us">
            <p>Questions about these Terms &amp; Conditions may be directed to:</p>
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
