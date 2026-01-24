const Privacy = () => {
  return (
    <div className="container px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Politique de confidentialité</h1>
      <p className="mb-4">Nous respectons votre vie privée. Nous collectons uniquement les informations nécessaires pour permettre la mise en relation (nom, coordonnées, annonces) et améliorer le service. Nous utilisons ces données pour :</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Permettre la communication entre acheteurs et vendeurs.</li>
        <li>Améliorer la pertinence des recherches et recommandations.</li>
        <li>Gérer les comptes et prévenir les abus.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-4">Partage de données</h2>
      <p className="mb-2">Nous ne partageons pas vos données personnelles avec des tiers commerciaux sans votre consentement explicite, sauf lorsque requis par la loi ou pour fournir un service (par exemple, solutions de paiement tiers).</p>

      <h2 className="text-lg font-semibold mt-4">Durée de conservation</h2>
      <p className="mb-2">Les données sont conservées tant que votre compte existe ou selon les obligations légales. Vous pouvez demander la suppression de vos données en contactant-nous via la page Contact.</p>
    </div>
  );
};

export default Privacy;
