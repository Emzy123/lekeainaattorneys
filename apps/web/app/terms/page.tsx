export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg">
        <p>Effective Date: {new Date().toLocaleDateString()}</p>
        <p>
          Welcome to LEX Platform. These terms and conditions outline the rules and regulations for the use of our Website and Services.
        </p>
        <h2>Intellectual Property</h2>
        <p>
          Unless otherwise stated, LEX Platform and/or its licensors own the intellectual property rights for all material on LEX Platform. All intellectual property rights are reserved.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          In no event shall LEX Platform, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.
        </p>
      </div>
    </div>
  );
}
