export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-lg">
        <p>Effective Date: {new Date().toLocaleDateString()}</p>
        <p>
          At LEX Platform, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our platform.
        </p>
        <h2>Personal Information We Collect</h2>
        <p>
          When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
        </p>
        <h2>How We Use Your Personal Information</h2>
        <p>
          We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
        </p>
      </div>
    </div>
  );
}
