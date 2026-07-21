import { HelpCircle, Mail } from "lucide-react";

const faqs = [
    {
        question: "How is my yield predicted?",
        answer:
            "YieldSense combines your farm's historical crop data, live weather readings, and soil analysis results and feeds them into a trained machine learning model. The model outputs an estimated yield for your selected crop and season, which you can track and compare against actual harvest results over time.",
    },
    {
        question: "Why do I need a soil report?",
        answer:
            "Soil nutrients (like nitrogen, phosphorus, and potassium), pH, and moisture levels are strong predictors of crop performance. Uploading a soil report lets the prediction model account for your field's actual conditions instead of relying on regional averages, which improves accuracy.",
    },
    {
        question: "How accurate are predictions?",
        answer:
            "Accuracy varies by crop and region, and improves as more real harvest data is recorded. Visit the Reports page to see your farm's Mean Absolute Percentage Error (MAPE), calculated from predictions you've confirmed with actual yield entries after harvest.",
    },
    {
        question: "How do I record my actual yield after harvest?",
        answer:
            "Go to Dashboard > Reports, find the prediction entry for that harvest, and use the 'Record Actual Yield' form to submit the real observed yield. This feeds back into your accuracy tracking and helps refine future predictions.",
    },
    {
        question: "What do the risk and anomaly flags on the Analytics page mean?",
        answer:
            "Each prediction is compared against your farm's historical average using a z-score. Predictions that deviate significantly (a high z-score) are flagged so you can investigate unusual conditions, such as extreme weather or data entry errors.",
    },
    {
        question: "Who can see my farm data?",
        answer:
            "Your farm, weather, soil, and prediction data are scoped to your account and role. Agriculture Department, Consultant, and Researcher roles may see aggregated or assigned farm data depending on permissions configured by your administrator.",
    },
];

export default function SupportPage() {

    return (
        <div className="space-y-8">

            <h1 className="text-4xl font-bold flex items-center gap-3">
                <HelpCircle size={32} />
                Support &amp; Help
            </h1>

            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-2xl font-bold">
                    Frequently Asked Questions
                </h2>

                {faqs.map((faq) => (
                    <div key={faq.question} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <p className="font-semibold text-lg">
                            {faq.question}
                        </p>

                        <p className="text-gray-600 mt-2">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <Mail size={22} />
                    Contact Us
                </h2>

                <p className="text-gray-600">
                    Can&apos;t find what you&apos;re looking for? Reach out to our
                    support team and we&apos;ll help you out.
                </p>

                <p className="mt-3 font-medium">
                    support@yieldsense.ai
                    <span className="text-sm text-gray-400 ml-2">
                        (placeholder — configure in production)
                    </span>
                </p>
            </div>

        </div>
    );

}
