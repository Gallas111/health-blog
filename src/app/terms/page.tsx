import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | 오늘도 건강',
    description: '오늘도 건강 이용약관',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6">
                <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
                    <p>
                        By accessing our website <strong>오늘도 건강</strong>, accessible from www.wellnesstodays.com, you are agreeing to be bound by these website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. Intellectual Property Rights</h2>
                    <p>
                        Other than the content you own, under these Terms, 오늘도 건강 and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. Restrictions</h2>
                    <p>You are specifically restricted from all of the following:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>publishing any Website material in any other media;</li>
                        <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                        <li>using this Website in any way that is or may be damaging to this Website;</li>
                        <li>using this Website contrary to applicable laws and regulations;</li>
                        <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">4. Limitation of Liability</h2>
                    <p>
                        In no event shall 오늘도 건강, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website. 오늘도 건강, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">5. Disclaimer</h2>
                    <p>
                        The materials on 오늘도 건강's Website are provided on an 'as is' basis. 오늘도 건강 makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                    <p className="mt-2">
                        Further, 오늘도 건강 does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Website or otherwise relating to such materials or on any sites linked to this site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">6. Governing Law & Jurisdiction</h2>
                    <p>
                        These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.
                    </p>
                </section>
            </div>
        </div>
    );
}
