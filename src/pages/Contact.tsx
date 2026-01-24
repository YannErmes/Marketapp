const Contact = () => {
  return (
    <div className="container px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <p className="mb-4">Si vous avez des questions, des commentaires ou une demande concernant une annonce, contactez-nous à :</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Email : <a href="mailto:contact@dardyali.example" className="text-primary">contact@dardyali.example</a></li>
        <li>Pour signaler un problème : utilisez la page Contact en précisant la référence du produit ou du vendeur.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-4">Support local</h2>
      <p className="mb-2">Nous répondons généralement sous 48 heures ouvrables. Merci de votre patience.</p>
    </div>
  );
};

export default Contact;
