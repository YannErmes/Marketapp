const Cookies = () => {
  return (
    <div className="container px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Politique des Cookies</h1>
      <p className="mb-4">Dardyali utilise des cookies et des technologies similaires pour assurer le fonctionnement du site, mémoriser vos préférences et analyser l'utilisation afin d'améliorer le service.</p>

      <h2 className="text-lg font-semibold mt-4">Types de cookies</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Cookies essentiels : nécessaires au fonctionnement du site.</li>
        <li>Cookies de performance : nous aident à comprendre l'utilisation et à améliorer l'expérience.</li>
        <li>Cookies de fonctionnalité : mémorisent vos préférences.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-4">Gestion des cookies</h2>
      <p className="mb-2">Vous pouvez désactiver les cookies via les paramètres de votre navigateur, mais cela peut affecter le fonctionnement du site.</p>
    </div>
  );
};

export default Cookies;
