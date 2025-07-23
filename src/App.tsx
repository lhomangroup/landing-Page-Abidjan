import React, { useState } from 'react';
import { CheckCircle, Plane, Shield, Home, Users, Mail, CheckCheck } from 'lucide-react';
import { ChecklistService, SubscriberData } from './services/checklistService';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gdprConsent: false
  });
  const [formMessage, setFormMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleChecklistChange = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage('');
    setIsLoading(true);

    try {
      // Validation côté client
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setFormMessage('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormMessage('Veuillez entrer une adresse email valide.');
        return;
      }

      if (!formData.gdprConsent) {
        setFormMessage('Vous devez accepter la politique de confidentialité pour continuer.');
        return;
      }

      // Envoyer les données au backend
      const result = await ChecklistService.subscribeAndSendChecklist(formData);
      
      setFormMessage(result.message || 'Checklist envoyée avec succès ! Vérifiez votre boîte email.');
      setIsSuccess(true);
      
      // Réinitialiser le formulaire après succès
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        gdprConsent: false
      });

    } catch (error: any) {
      console.error('Erreur soumission:', error);
      setFormMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const ChecklistItem = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <li className="mb-3 flex items-start">
      <label className="flex items-start cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            className="sr-only"
            checked={checkedItems[id] || false}
            onChange={() => handleChecklistChange(id)}
          />
          <div className={`w-5 h-5 border-2 rounded border-gray-400 transition-all duration-300 ${
            checkedItems[id] 
              ? 'bg-red-500 border-red-500' 
              : 'hover:border-red-400'
          }`}>
            {checkedItems[id] && (
              <CheckCircle className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
            )}
          </div>
        </div>
        <span className={`ml-3 transition-all duration-300 ${
          checkedItems[id] 
            ? 'line-through opacity-70' 
            : 'group-hover:text-gray-300'
        }`}>
          {children}
        </span>
      </label>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      {/* Header */}
      <header className="text-center py-20 px-5 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex justify-center mb-4">
          <Plane className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
          La Checklist du Voyageur Malin
        </h1>
        <h2 className="text-xl md:text-2xl font-normal text-gray-400">
          Économies & Confort à Abidjan
        </h2>
      </header>

      <main className="max-w-4xl mx-auto px-5">
        {/* Introduction */}
        <section className="py-16 border-b border-gray-800">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-lg leading-relaxed text-gray-300">
              Vous rêvez d'un séjour à Abidjan où <strong className="text-red-500">confort rime avec liberté</strong>, et où votre budget n'est plus une source de stress ? Vous en avez assez des hôtels qui se ressemblent tous, où chaque service extra fait exploser la facture, et où l'autonomie est un luxe inaccessible ? Vous n'êtes pas seul(e) !
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Beaucoup de voyageurs, surtout ceux de la diaspora ou les connaisseurs d'Abidjan, se heurtent à la même réalité : trouver un logement qui offre à la fois la <strong className="text-red-500">sécurité</strong>, l'<strong className="text-red-500">authenticité</strong> et un <strong className="text-red-500">rapport qualité-prix imbattable</strong> relève du parcours du combattant.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Mais imaginez un instant : un séjour où vous vous sentez vraiment "chez vous", avec tout l'espace et les équipements dont vous avez besoin, des services facilitants, et un budget maîtrisé. Ce n'est pas un rêve, c'est la promesse de cette checklist.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
            Déjouez les Pièges et Maximisez Votre Séjour
          </h2>

          {/* Problem-Solution Block 1 */}
          <div className="bg-gray-800 rounded-lg p-8 mb-10 border border-gray-700">
            <h3 className="text-2xl font-medium mb-6">
              Erreur n°1 : Payer le prix fort pour une chambre d'hôtel standardisée
            </h3>
            
            <div className="space-y-5">
              <p className="leading-relaxed">
                <strong className="text-red-400">Le Problème :</strong> Les hôtels à Abidjan peuvent être chers, surtout ceux qui offrent un minimum de confort et de sécurité. Pour ce prix, vous obtenez souvent une chambre étroite, sans cuisine, sans espace de vie réel, et avec des frais cachés pour le Wi-Fi, la lessive ou même une simple bouteille d'eau.
              </p>
              
              <p className="leading-relaxed">
                <strong className="text-green-400">La Solution :</strong> Ne vous limitez pas à l'hôtel ! Explorez les options de <strong className="text-red-500">location de chambre privée avec accès aux espaces de vie communs</strong> dans de belles villas. C'est le meilleur des deux mondes : la sécurité et les services d\'un hôtel combinés à l\'espace, l\'autonomie et le charme d\'une résidence privée.
              </p>
              
              <p className="leading-relaxed text-gray-300">
                <strong>Mon anecdote personnelle :</strong> Je me souviens de ma première fois à Abidjan pour un projet. J'avais réservé un hôtel "bien situé", pensant faire le bon choix. Mais après trois jours, je me sentais claustrophobe dans ma chambre, et la facture du room service était ahurissante. La fois suivante, j'ai tenté l'expérience d'une chambre privée chez l'habitant avec accès à toute la maison. Ma facture a été divisée par trois !
              </p>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-medium text-red-500 mb-4">Checklist d'Action :</h4>
              <ul className="space-y-2">
                <ChecklistItem id="budget">
                  Définissez clairement votre <strong>budget maximal par nuit</strong> avant de commencer vos recherches.
                </ChecklistItem>
                <ChecklistItem id="filter">
                  Sur les plateformes de location, filtrez par "<strong>chambre privée</strong>" et indiquez votre destination (Abidjan, Cocody Angré).
                </ChecklistItem>
                <ChecklistItem id="description">
                  Lisez attentivement la description pour vérifier l'<strong>accès aux parties communes</strong> (salon, cuisine, jardin).
                </ChecklistItem>
                <ChecklistItem id="compare">
                  Comparez le prix avec celui des hôtels de même standing dans le même quartier.
                </ChecklistItem>
              </ul>
            </div>
          </div>

          {/* Problem-Solution Block 2 */}
          <div className="bg-gray-800 rounded-lg p-8 mb-10 border border-gray-700">
            <h3 className="text-2xl font-medium mb-6">
              Erreur n°2 : Manquer d'autonomie et de flexibilité pendant votre séjour
            </h3>
            
            <div className="space-y-5">
              <p className="leading-relaxed">
                <strong className="text-red-400">Le Problème :</strong> En hôtel, vous êtes souvent contraint par les horaires des repas, l'absence de cuisine pour préparer vos propres plats, et le manque d'espace pour travailler ou vous détendre en dehors de votre lit.
              </p>
              
              <p className="leading-relaxed">
                <strong className="text-green-400">La Solution :</strong> Optez pour une option qui vous offre la <strong className="text-red-500">liberté d'un chez-soi sans les contraintes d'une location longue durée</strong>. Une chambre dans une villa où l'intégralité des espaces de vie est à votre disposition est idéale.
              </p>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-medium text-red-500 mb-4">Checklist d'Action :</h4>
              <ul className="space-y-2">
                <ChecklistItem id="kitchen">
                  Vérifiez la présence d'une <strong>cuisine entièrement équipée</strong> accessible aux locataires.
                </ChecklistItem>
                <ChecklistItem id="living">
                  Assurez-vous que l'annonce mentionne un <strong>salon spacieux</strong> et d'autres espaces de détente.
                </ChecklistItem>
                <ChecklistItem id="guests">
                  Renseignez-vous sur la politique d'accueil des invités si vous prévoyez de recevoir famille ou amis.
                </ChecklistItem>
                <ChecklistItem id="access">
                  Cherchez des annonces qui mettent en avant la "<strong>maison entière à disposition</strong>".
                </ChecklistItem>
              </ul>
            </div>
          </div>

          {/* Problem-Solution Block 3 */}
          <div className="bg-gray-800 rounded-lg p-8 mb-10 border border-gray-700">
            <h3 className="text-2xl font-medium mb-6">
              Erreur n°3 : L'incertitude sur la sécurité et la propreté
            </h3>
            
            <div className="space-y-5">
              <p className="leading-relaxed">
                <strong className="text-red-400">Le Problème :</strong> Une préoccupation majeure pour beaucoup, surtout en arrivant dans un pays inconnu, est la sécurité du logement et la garantie d'une propreté impeccable.
              </p>
              
              <p className="leading-relaxed">
                <strong className="text-green-400">La Solution :</strong> Privilégiez les offres qui incluent des <strong className="text-red-500">services clairs de sécurité et de maintenance</strong>. La présence d'un gardien 24h/24 et d\'un service de ménage régulier est un gage de tranquillité d\'esprit.
              </p>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-medium text-red-500 mb-4">Checklist d'Action :</h4>
              <ul className="space-y-2">
                <ChecklistItem id="security">
                  Vérifiez si la propriété dispose d'un <strong>gardien ou système de sécurité</strong>.
                </ChecklistItem>
                <ChecklistItem id="cleaning">
                  Renseignez-vous sur la <strong>fréquence du ménage</strong> inclus dans le prix.
                </ChecklistItem>
                <ChecklistItem id="reviews">
                  Lisez les <strong>avis des précédents voyageurs</strong> sur la propreté et la sécurité.
                </ChecklistItem>
                <ChecklistItem id="location">
                  Assurez-vous que l'emplacement est dans un <strong>quartier réputé sécurisé</strong>.
                </ChecklistItem>
              </ul>
            </div>
          </div>
        </section>

        {/* Bonus Section */}
        <section className="py-16 border-b border-gray-800">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
            Section Bonus : Votre Mini-Programme pour un Départ Zen et Organisé !
          </h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Pour vous aider à concrétiser votre prochain voyage malin, voici un petit programme en 3 étapes :
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-red-500 mr-3" />
                <h4 className="text-xl font-medium text-red-500">
                  Étape 1 : Le Bilan "Besoin Vs Envie" (10 minutes)
                </h4>
              </div>
              <p className="mb-4">Prenez une feuille et listez :</p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Mes 3 impératifs :</strong> (Ex: sécurité, cuisine, calme)</li>
                <li>• <strong>Mes 3 envies :</strong> (Ex: grand jardin, proche supermarché)</li>
                <li>• <strong>Mon budget max / nuit :</strong> (Ex: 30 000 FCFA)</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <Home className="w-6 h-6 text-red-500 mr-3" />
                <h4 className="text-xl font-medium text-red-500">
                  Étape 2 : La Recherche Stratégique (30 minutes)
                </h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Ouvrez Airbnb ou d'autres plateformes</li>
                <li>• Entrez "Abidjan, Cocody Angré" comme destination</li>
                <li>• Filtrez par "chambre privée"</li>
                <li>• Concentrez-vous sur l'accès aux espaces de vie complets</li>
                <li>• Repérez les services inclus (ménage, gardien)</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-red-500 mr-3" />
                <h4 className="text-xl font-medium text-red-500">
                  Étape 3 : Le "Match Parfait" (5 minutes)
                </h4>
              </div>
              <p className="text-sm">
                Comparez les 2-3 meilleures options que vous avez trouvées avec vos besoins. Laquelle correspond le mieux à l'idée d'un séjour ultra-compétitif, confortable, et autonome ?
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion and Form */}
        <section className="py-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:flex-[2] min-w-0">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-left">
                Votre Prochain Séjour à Abidjan Ne Sera Plus Jamais Pareil !
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Félicitations ! Vous avez désormais entre les mains la <strong className="text-red-500">Checklist du Voyageur Malin</strong>, un véritable mode d'emploi pour transformer vos séjours à Abidjan.
                </p>
                <p className="text-lg leading-relaxed">
                  Imaginez-vous déjà : vous réveiller dans une belle villa, prendre votre café dans un grand salon baigné de lumière, profiter du jardin, tout en sachant que votre budget est respecté et que votre sécurité est assurée.
                </p>
                <p className="text-lg leading-relaxed">
                  Prêt(e) à faire de votre prochaine visite à Abidjan une expérience inoubliable et sans souci ?
                </p>
              </div>
            </div>

            <div className="lg:flex-1 w-full max-w-md">
              <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
                {isSuccess ? (
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCheck className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-medium text-green-400">
                      Checklist envoyée !
                    </h3>
                    <p className="text-gray-300">
                      Vérifiez votre boîte email (et vos spams) pour recevoir votre checklist complète.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>Email envoyé à {formData.email}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-medium text-center mb-8">
                      Téléchargez votre Checklist Gratuite !
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="firstName" className="block mb-2 font-medium text-gray-300">
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          disabled={isLoading}
                          className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-red-500 focus:bg-red-900/10 outline-none transition-all duration-200 disabled:opacity-50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block mb-2 font-medium text-gray-300">
                          Nom
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          disabled={isLoading}
                          className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-red-500 focus:bg-red-900/10 outline-none transition-all duration-200 disabled:opacity-50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block mb-2 font-medium text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={isLoading}
                          className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-red-500 focus:bg-red-900/10 outline-none transition-all duration-200 disabled:opacity-50"
                        />
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            id="gdprConsent"
                            name="gdprConsent"
                            checked={formData.gdprConsent}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="sr-only"
                          />
                          <div 
                            className={`w-5 h-5 border-2 rounded border-gray-400 cursor-pointer transition-all duration-300 ${
                              formData.gdprConsent 
                                ? 'bg-red-500 border-red-500' 
                                : 'hover:border-red-400'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            onClick={() => !isLoading && setFormData(prev => ({ ...prev, gdprConsent: !prev.gdprConsent }))}
                          >
                            {formData.gdprConsent && (
                              <CheckCircle className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                            )}
                          </div>
                        </div>
                        <label htmlFor="gdprConsent" className="text-sm text-gray-300 cursor-pointer">
                          J'accepte de recevoir des communications concernant des astuces de voyage et des offres spéciales.
                        </label>
                      </div>
                      
                      {formMessage && (
                        <p className={`text-center text-sm ${
                          formMessage.includes('succès') || formMessage.includes('envoyée') 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {formMessage}
                        </p>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 active:transform active:translate-y-0 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? 'Envoi en cours...' : 'Recevoir Ma Checklist'}
                      </button>
                    </form>
                  </>
                )}
                
                <p className="text-sm text-gray-400 text-center mt-6 leading-relaxed">
                  P.S. : Vous avez aimé cette checklist ? Inscrivez-vous à notre newsletter exclusive pour recevoir d'autres astuces de voyage, des bons plans sur Abidjan et des offres spéciales pour vos futurs séjours !
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="py-12 text-center border-t border-gray-800">
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Pour découvrir concrètement comment nous incarnons cette philosophie, et peut-être trouver votre prochain chez-vous loin de chez vous, 
            <a 
              href="https://www.lhomangroup.com" 
              className="text-red-500 hover:text-red-400 font-medium underline decoration-red-500/30 hover:decoration-red-400 transition-colors duration-200 ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              cliquez ici
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-10 px-5 text-gray-400 border-t border-gray-800 mt-10">
        <p>&copy; 2025 Lhoman Group. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;