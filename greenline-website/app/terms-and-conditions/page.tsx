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
        <p className="text-sm font-body text-gray-400 mb-10">Last updated: May 2026</p>

        <div className="space-y-10">

          <Block title="1. Acceptance of Terms">
            <p>By accessing or using the Greenline Activations website at greenlineactivations.com (&quot;Site&quot;), you agree to be bound by these Terms &amp; Conditions and our Privacy Policy. If you do not agree, please do not use the Site. These terms apply to all visitors, users, and others who access or use the Site. By completing a purchase or booking through this Site, you also agree to the service terms outlined in Sections 14–17 below, which govern all activation sprint engagements.</p>
          </Block>

          <Block title="2. About Greenline Activations">
            <p>Greenline Activations provides field marketing, brand ambassador management, retail activation, and related services for hemp and functional beverage brands in Florida. Purchasing a sprint through this Site constitutes a binding service engagement governed by these Terms &amp; Conditions. No separate written contract is required.</p>
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
            <p>These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any disputes arising from these Terms, your use of the Site, or any activation sprint engagement shall be resolved in the state or federal courts located in Florida.</p>
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

        {/* Activation Sprint Service Terms */}
        <div className="mt-16 mb-10 border-t-2 border-ink pt-12">
          <p className="tag mb-4 inline-block">Service Agreement</p>
          <h2 className="text-3xl font-bold text-dark mt-4 mb-3">Activation Sprint Service Terms</h2>
          <p className="font-body text-gray-500 text-sm leading-relaxed">
            Sections 14–17 govern all activation sprint purchases and engagements. By completing checkout on this Site, you agree to these terms in full.
          </p>
        </div>

        <div className="space-y-10">

          <Block title="14. Payment Terms">
            <p><strong>50% Deposit Required at Booking.</strong> All activation sprint purchases require a 50% deposit at the time of booking, collected via Stripe. The remaining balance is due prior to the first activation event in the sprint, per the schedule communicated during onboarding.</p>
            <p>By completing checkout, you authorize Greenline Activations to charge the deposit amount to the payment method provided. All prices are in USD. Deposits are processed securely through Stripe.</p>
            <p>Failure to remit the remaining balance by the agreed-upon date may result in suspension or cancellation of the sprint at Greenline Activations&apos; sole discretion, with the deposit forfeited.</p>
          </Block>

          <Block title="15. Cancellation Policy">
            <p><strong>Brand or Retailer-Initiated Cancellation</strong></p>
            <p><strong>48+ hours notice — no charge / rescheduled:</strong> If a brand or retailer cancels a scheduled activation event with at least 48 hours&apos; notice, the event may be rescheduled at no additional charge, subject to availability.</p>
            <p><strong>Less than 48 hours notice or no notice — full payment due:</strong> If a brand or retailer cancels with less than 48 hours&apos; notice, or provides no notice and Greenline Activations staff arrives at the retail location, the full payment for that activation event is due and non-refundable. No credit or rescheduling will be offered under these conditions.</p>
            <p><strong>Compliance, Product, or Packaging Issues</strong></p>
            <p>If a cancellation or suspension of an activation event is initiated — whether by the brand, retailer, or Greenline Activations — due to compliance concerns, product recalls, or packaging deficiencies, the client remains subject to full payment for that event. No refund will be issued. Greenline Activations is not responsible for regulatory or product-readiness issues outside of its control.</p>
            <p><strong>Sprint-Level Cancellation</strong></p>
            <p>Cancellation of an entire sprint after booking is non-refundable on the deposit. Any remaining unpaid balance for events already executed is still due. Greenline Activations reserves the right to cancel a sprint engagement if a client&apos;s product is found to be out of compliance with applicable Florida or federal law; in such cases, the deposit is forfeited.</p>
          </Block>

          <Block title="16. The Greenline Guarantee">
            <p>Greenline Activations stands behind the performance of every activation event. If Greenline Activations fails to show for a scheduled activation event for any reason within our control, or if an individual activation event delivers a conversion rate below 15% — measured as the ratio of product units purchased to units sampled at that event — we will reschedule and re-execute that event at no additional cost to the client.</p>
            <p><strong>How Conversion Is Measured</strong></p>
            <p>Conversion rate is calculated per individual activation event by comparing total consumer samples distributed to confirmed in-location purchases logged by Greenline staff at point of activation. Event-level conversion data will be included in each post-activation recap report.</p>
            <p><strong>Guarantee Cap</strong></p>
            <p>This guarantee applies to a maximum of 2 events per sprint, regardless of sprint size. If more than 2 events in a single sprint fall below the conversion threshold, Greenline Activations will work with the client to assess root cause — which may include product placement, retailer fit, or sampling material quality — before determining next steps.</p>
            <p><strong>Exclusions</strong></p>
            <p>This guarantee does not apply where underperformance is attributable to factors outside Greenline Activations&apos; control, including but not limited to: product unavailability, retailer restrictions, inadequate product placement, or client-provided sampling materials that are non-compliant or inaccurate.</p>
          </Block>

          <Block title="17. Brand Compliance Responsibility">
            <p>Brands engaging Greenline Activations for activation services represent and warrant that all products to be sampled or promoted are compliant with the 2018 Farm Bill, applicable Florida statutes, and any local ordinances governing hemp-derived, THC beverage, and functional beverage products at the time of each activation event.</p>
            <p>Greenline Activations is not responsible for verifying product compliance and reserves the right to suspend or cancel any activation event if, in Greenline Activations&apos; reasonable judgment, a product presents a compliance risk. In such cases, the cancellation terms in Section 15 apply and no refund will be issued.</p>
            <p>Brands are solely responsible for obtaining any required retailer or municipal permits for in-store sampling events. Greenline Activations does not assume liability for regulatory action taken against a brand&apos;s product during or following an activation.</p>
          </Block>

        </div>

        <div className="mt-16 pt-10 border-t border-gray-200 text-center">
          <p className="font-body text-sm text-gray-400">Greenline Activations — Built in Florida. Shipped to shelves nationwide.</p>
          <p className="font-body text-sm text-gray-400 mt-1">hello@greenlineactivations.com · greenlineactivations.com</p>
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
