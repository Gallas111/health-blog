import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | 오늘도 건강',
    description: '오늘도 건강 개인정보 처리방침',
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6">
                <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
                    <p>
                        Welcome to <strong>How-To AI</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your information when you visit our website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
                    <p>We may collect personal information that you voluntarily provide to us when you subscribe to our newsletter or contact us.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Email address (for newsletters or contact forms)</li>
                        <li>Names (if provided)</li>
                    </ul>

                    <h3 className="text-xl font-medium mt-4 mb-2">Automatically Collected Information</h3>
                    <p>When you visit our site, we may automatically collect certain information about your device and usage patterns via cookies and similar technologies (e.g., Google Analytics).</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Pages visited and time spent</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
                    <p>We use the collected information to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Provide and maintain our service</li>
                        <li>Improve user experience and analyze website traffic</li>
                        <li>Send you newsletters (if subscribed)</li>
                        <li>Respond to your inquiries</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">4. Cookies and Web Beacons</h2>
                    <p>
                        We use cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize or customize our web page content based on visitors' browser type or other information that the visitor sends via their browser.
                    </p>
                    <p className="mt-2">
                        <strong>Google DoubleClick DART Cookie:</strong> Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">5. Third-Party Privacy Policies</h2>
                    <p>
                        How-To AI's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">6. GDPR Data Protection Rights</h2>
                    <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>The right to access</li>
                        <li>The right to rectification</li>
                        <li>The right to erasure</li>
                        <li>The right to restrict processing</li>
                        <li>The right to object to processing</li>
                        <li>The right to data portability</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>By email: contact@wellnesstodays.com</li>
                        <li>By visiting this page on our website: /contact</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
