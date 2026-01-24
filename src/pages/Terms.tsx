import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="container px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Conditions d'utilisation</h1>
      <p className="mb-4">Bienvenue sur Dardyali. Ces Conditions d'utilisation régissent votre accès et votre utilisation de notre plateforme. En utilisant Dardyali, vous acceptez ces conditions.</p>

      <h2 className="text-lg font-semibold mt-4">Objet</h2>
      <p className="mb-2">Dardyali est un service qui facilite la mise en relation entre acheteurs et vendeurs déjà connus au sein de leurs communautés. Nous ne sommes pas un marché tiers s'efforçant de recréer de nouveaux liens ; nous aidons les vendeurs et acheteurs existants à se rencontrer en ligne et à échanger facilement.</p>

      <h2 className="text-lg font-semibold mt-4">Responsabilité</h2>
      <p className="mb-2">Les vendeurs sont responsables des descriptions, des prix, de la disponibilité et des modalités de vente. Dardyali fournit la plateforme technique pour faciliter la communication et la visibilité.</p>

      <h2 className="text-lg font-semibold mt-4">Utilisateur</h2>
      <p className="mb-2">Les utilisateurs doivent être honnêtes dans leurs annonces et respecter les lois locales. Le non-respect de ces règles peut entraîner la suspension du compte.</p>

      <h2 className="text-lg font-semibold mt-4">Contact</h2>
      <p>Pour toute question concernant ces conditions, utilisez la page <Link to="/contact" className="text-primary">Contact</Link>.</p>
    </div>
  );
};

export default Terms;
