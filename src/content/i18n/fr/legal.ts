/**
 * Juridiskt innehåll och informationssidor på franska (fr-FR), lokaliserat för Frankrike, Belgien och Luxemburg.
 * Samma nycklar och blockstruktur som src/content/legal.ts. `slug` är det interna id:t (svenskt).
 * Platshållare som {epost} och {företag} fylls i när sidan visas (lib/page-text).
 */
import type { LegalBlock, LegalDoc } from "@/content/legal";

const updated = "Dernière mise à jour : 2 novembre 2026";

const contactBlock: LegalBlock[] = [
  { type: "h2", text: "Coordonnées et informations sur l'entreprise" },
  { type: "companyInfo" },
];

const helpBlock: LegalBlock[] = [
  { type: "h2", text: "Besoin d'aide ?" },
  {
    type: "p",
    text: `Écrivez-nous à {epost} ou appelez le {telefon} ({öppettider}). Indiquez toujours votre numéro de commande : nous pourrons vous aider plus rapidement. Notre service client répond en suédois et en anglais.`,
  },
];

const disputeText =
  "Si nous ne parvenons pas à un accord, vous pouvez obtenir des informations et de l'aide gratuites auprès du Centre européen des consommateurs de votre pays (réseau ECC-Net) et soumettre le litige à la juridiction compétente de votre pays de résidence. Les droits impératifs dont vous bénéficiez en tant que consommateur en vertu du droit de votre pays de résidence s'appliquent.";

/* ------------------------------ Confidentialité ------------------------------ */

const privacy: LegalDoc = {
  slug: "integritetspolicy",
  title: "Politique de confidentialité",
  updated,
  intro:
    "Cette politique explique quelles données personnelles Metilde collecte lorsque vous visitez metilde.com, passez une commande ou gérez un abonnement, pourquoi nous les traitons, combien de temps nous les conservons et quels sont vos droits en vertu du RGPD.",
  metaTitle: "Politique de confidentialité",
  metaDescription:
    "Comment Metilde collecte, utilise, partage et protège vos données personnelles, combien de temps nous les conservons et comment exercer vos droits en vertu du RGPD.",
  blocks: [
    ...contactBlock,
    {
      type: "p",
      text: `{företag} est responsable du traitement décrit ici. Contactez-nous à {epost} si vous avez des questions ou souhaitez exercer vos droits.`,
    },
    { type: "h2", text: "Les données que nous collectons" },
    {
      type: "ul",
      items: [
        "Données de commande : nom, adresses de livraison et de facturation, adresse e-mail, numéro de téléphone, contenu de la commande, historique des commandes et retours.",
        "Données de compte : adresse e-mail et paramètres d'abonnement. Vous vous connectez avec un code à usage unique envoyé à votre adresse e-mail ; nous ne stockons donc aucun mot de passe.",
        "Données de paiement : moyen de paiement, identifiant de transaction et statut du paiement. Les numéros de carte complets ne sont jamais stockés par nous, mais traités par notre prestataire de paiement.",
        "Données de service client : messages, demandes et pièces jointes que vous envoyez au service client.",
        "Données marketing : adresse e-mail et statut du consentement si vous vous abonnez à la newsletter.",
        "Données de panier : adresse e-mail et contenu du panier lorsque vous avez commencé un achat dans la caisse, afin de conserver votre panier et de vous le rappeler par e-mail (au maximum quatre fois en dix jours). Chaque rappel contient un lien pour ne plus en recevoir.",
        "Données techniques : adresse IP, type d'appareil et de navigateur, pages consultées et interactions, collectées au moyen de cookies et de technologies similaires.",
      ],
    },
    { type: "h2", text: "Finalités et base juridique" },
    {
      type: "table",
      head: ["Finalité", "Base juridique", "Durée de conservation"],
      rows: [
        ["Traiter et livrer votre commande, gérer les retours et les remboursements", "Exécution du contrat", "Pendant la commande et la durée de la garantie"],
        ["Gérer votre compte et vos abonnements", "Exécution du contrat", "Jusqu'à la suppression de votre compte"],
        ["Comptabilité et obligations fiscales", "Obligation légale (règles comptables applicables)", "7 ans"],
        ["Service client et réclamations", "Intérêt légitime", "36 mois après la clôture du dossier"],
        ["Newsletter et marketing", "Consentement", "Jusqu'au retrait de votre consentement"],
        ["Analyse et amélioration du site", "Consentement (cookies non essentiels)", "Jusqu'à 24 mois"],
        ["Prévention de la fraude et sécurité informatique", "Intérêt légitime", "12 mois"],
      ],
    },
    { type: "h2", text: "Avec qui nous partageons vos données" },
    {
      type: "p",
      text: "Nous ne vendons jamais vos données personnelles. Nous les partageons uniquement avec des sous-traitants qui nous aident à faire fonctionner la boutique, et seulement dans la mesure nécessaire :",
    },
    {
      type: "ul",
      items: [
        "Prestataires de paiement, pour le paiement et le contrôle des fraudes.",
        "Partenaires logistiques et transporteurs, pour la livraison et les retours.",
        "Fournisseurs d'hébergement, de base de données et d'e-mail, pour faire fonctionner le site et envoyer les e-mails liés à votre commande.",
        "Paiement via Stripe (carte, Klarna, Apple Pay, Google Pay), stockage et expédition via MittLogistik et PostNord, e-mail via Resend, hébergement et base de données via Vercel et Supabase.",
        "Meta (Facebook, Instagram), Google Ads et Microsoft Advertising, pour mesurer nos publicités. Avec votre consentement aux cookies marketing, ils reçoivent des données sur votre visite et votre achat, ainsi que votre adresse e-mail sous forme hachée afin de rattacher l'achat à une publicité. Sans consentement, la balise de Google envoie uniquement des signaux anonymes, sans cookies.",
        "AddRevenue, si vous êtes arrivé chez nous via un lien d'affiliation : numéro et montant de la commande, afin de verser une commission à l'auteur du lien.",
        "Autorités publiques, lorsque la loi nous oblige à communiquer des informations.",
      ],
    },
    {
      type: "p",
      text: "Tous les sous-traitants sont liés par un accord de traitement des données. Lorsqu'un transfert hors de l'UE/EEE est nécessaire, il est protégé par les clauses contractuelles types de la Commission européenne, complétées par des mesures de protection supplémentaires.",
    },
    { type: "h2", text: "Vos droits" },
    {
      type: "ul",
      items: [
        "Accès – obtenir un relevé des données que nous détenons sur vous.",
        "Rectification – faire corriger des données inexactes.",
        "Effacement – faire supprimer vos données lorsque nous n'en avons plus besoin.",
        "Limitation et opposition – limiter certains traitements ou vous y opposer, y compris la prospection commerciale.",
        "Portabilité – recevoir vos données dans un format lisible par machine.",
        "Retrait du consentement – à tout moment, sans incidence sur les traitements déjà effectués.",
      ],
    },
    {
      type: "p",
      text: `Écrivez à {epost} pour exercer un droit. Nous répondons sous 30 jours. Si vous n'êtes pas satisfait de la manière dont nous traitons vos données, vous pouvez introduire une réclamation auprès de l'autorité de protection des données de votre pays de résidence (en France, la CNIL, cnil.fr).`,
    },
    { type: "h2", text: "Sécurité" },
    {
      type: "p",
      text: "Le site est servi via TLS, la connexion se fait avec des codes à usage unique, l'accès aux données personnelles est limité au personnel qui en a besoin, et nos systèmes sont protégés par la journalisation et des droits d'accès basés sur les rôles.",
    },
    { type: "h2", text: "Enfants" },
    { type: "p", text: "La boutique ne s'adresse pas aux enfants. Vous devez avoir 18 ans ou plus pour commander ou créer un compte." },
    { type: "h2", text: "Modifications de cette politique" },
    {
      type: "p",
      text: "Nous pouvons mettre à jour cette politique lorsque nos services ou les exigences légales évoluent. La date ci-dessus indique toujours la version en vigueur, et les modifications importantes sont communiquées par e-mail aux clients enregistrés.",
    },
  ],
};

/* ------------------------------- Conditions générales de vente ------------------------------- */

const terms: LegalDoc = {
  slug: "kopvillkor",
  title: "Conditions générales de vente",
  updated,
  intro:
    "Ces conditions s'appliquent à toutes les commandes passées par des consommateurs sur metilde.com. Elles couvrent les prix, le paiement, la livraison, les abonnements, le droit de rétractation, les retours, le remboursement et les réclamations.",
  metaTitle: "Conditions générales de vente",
  metaDescription:
    "Les conditions générales de vente de Metilde : prix et paiement, délais et frais de livraison, abonnements, droit de rétractation, retours, remboursement et réclamations.",
  blocks: [
    ...contactBlock,
    { type: "h2", text: "Commande et contrat" },
    {
      type: "p",
      text: "Un contrat ferme est conclu dès que nous confirmons votre commande par e-mail. Vous devez avoir au moins 18 ans pour commander. Si un produit est en rupture de stock ou si un prix est manifestement erroné, nous pouvons annuler la commande et rembourser le montant éventuellement débité. Toutes les communications se font en suédois ou en anglais.",
    },
    { type: "h2", text: "Prix, TVA et paiement" },
    {
      type: "ul",
      items: [
        "Tous les prix sont affichés en euros (EUR), TVA comprise. Le montant total, frais de livraison inclus, s'affiche avant que vous ne confirmiez la commande.",
        "Moyens de paiement acceptés : Klarna, Visa, Mastercard, American Express, Apple Pay et Google Pay.",
        "Pour un achat unique, le paiement est débité au moment où vous passez la commande.",
        "Nous livrons notamment en France, en Belgique et au Luxembourg. Les commandes à destination de ces pays sont expédiées au sein de l'UE : aucun droit de douane ni frais d'importation ne s'y ajoute jamais.",
      ],
    },
    { type: "h2", text: "Livraison" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Les commandes passées un jour ouvré avant 12 h (CET) sont normalement expédiées le jour même depuis notre entrepôt. Les commandes à destination de la France, de la Belgique et du Luxembourg partent avec PostNord en lettre suivie ; le délai de livraison est normalement de 3 à 6 jours ouvrés. Vous recevez un lien de suivi par e-mail dès que l'envoi quitte nos locaux. Pour les colis non retirés, nous facturons les frais réels d'expédition aller et retour.",
    },
    { type: "h2", text: "Abonnement" },
    {
      type: "ul",
      items: [
        "Un abonnement donne droit à 15 % de réduction sur le prix normal et est livré selon la fréquence que vous choisissez.",
        "La première livraison est payée directement lors de l'achat. Ensuite, le paiement est débité automatiquement au début de chaque nouvelle période, tous les 30, 60 ou 90 jours à compter de l'achat. Le colis est expédié quelques jours après le prélèvement et vous recevez un e-mail indiquant la date de livraison prévue.",
        "Vous pouvez mettre en pause ou résilier votre abonnement à tout moment jusqu'à la veille du prochain renouvellement, vous-même dans Mon compte ou en écrivant au service client. Pour modifier la fréquence, la quantité ou le produit, écrivez au service client. Les modifications communiquées plus tard s'appliquent à partir de la livraison suivante.",
        "L'abonnement court jusqu'à ce que vous le résiliiez. Aucune durée minimale et aucun frais de résiliation.",
      ],
    },
    { type: "h2", text: "Droit de rétractation" },
    {
      type: "p",
      text: `En tant que consommateur, vous disposez d'un droit légal de rétractation de 14 jours à compter du jour où vous recevez le produit – nous le prolongeons à 30 jours. Contactez-nous à {epost} ou utilisez le formulaire type de rétractation de l'UE. Le produit doit être retourné inutilisé et dans son emballage d'origine non ouvert. Pour des raisons d'hygiène et de sécurité alimentaire, les compléments alimentaires dont le scellé a été rompu ne peuvent pas être retournés.`,
    },
    { type: "h2", text: "Retour et remboursement" },
    {
      type: "ul",
      items: [
        "Informez-nous dans les 30 jours suivant la réception et renvoyez le produit dans les 14 jours suivant votre notification.",
        "En cas de rétractation, les frais de retour sont à votre charge (8,00 € sont déduits du remboursement). Si le produit est défectueux ou si nous nous sommes trompés dans la livraison, nous prenons en charge les frais de retour.",
        "Nous remboursons le prix d'achat, y compris les frais de livraison standard que vous avez payés, dans les 14 jours suivant la réception du retour ou d'une preuve d'expédition.",
        "Le remboursement est effectué via le moyen de paiement d'origine.",
        "Si le produit a perdu de la valeur parce que vous l'avez manipulé au-delà de ce qui est nécessaire pour l'examiner, nous pouvons déduire un montant correspondant.",
      ],
    },
    { type: "h2", text: "Réclamations et produits défectueux" },
    {
      type: "p",
      text: `Vous bénéficiez du droit de réclamation prévu par le droit de la consommation qui vous est applicable, notamment la garantie légale de conformité. Écrivez à {epost} en indiquant votre numéro de commande et en joignant une photo du défaut. Une réclamation acceptée donne lieu à un nouveau produit ou à un remboursement, et nous prenons en charge les frais de retour.`,
    },
    { type: "h2", text: "Informations sur les produits" },
    {
      type: "p",
      text: "Nos produits sont des compléments alimentaires et ne sont pas destinés à prévenir, traiter ou guérir une maladie. Un complément alimentaire ne remplace pas une alimentation variée et un mode de vie sain. Lisez toujours l'étiquette, respectez la dose journalière recommandée et conservez le produit hors de portée des enfants. Demandez conseil à un médecin si vous êtes enceinte, allaitez ou prenez des médicaments.",
    },
    { type: "h2", text: "Litiges" },
    { type: "p", text: disputeText },
  ],
};

/* -------------------------------- Cookies -------------------------------- */

const cookies: LegalDoc = {
  slug: "cookies",
  title: "Politique relative aux cookies",
  updated,
  intro:
    "Les cookies sont de petits fichiers texte enregistrés sur votre appareil lorsque vous visitez metilde.com. Nous les utilisons pour faire fonctionner la boutique, mémoriser vos choix et comprendre comment le site est utilisé.",
  metaTitle: "Politique relative aux cookies",
  metaDescription:
    "Quels cookies Metilde utilise, à quoi ils servent, combien de temps ils sont conservés et comment modifier ou retirer votre consentement.",
  blocks: [
    { type: "h2", text: "Consentement" },
    {
      type: "p",
      text: "Les cookies essentiels sont déposés automatiquement, car la boutique ne fonctionne pas sans eux. Les cookies d'analyse et de marketing ne sont déposés qu'après votre accord. Vous pouvez modifier ou retirer votre consentement à tout moment via les paramètres des cookies en bas de page, ou en effaçant les cookies de votre navigateur.",
    },
    { type: "h2", text: "Les cookies que nous utilisons" },
    { type: "h3", text: "Essentiels" },
    {
      type: "table",
      head: ["Cookie", "Finalité", "Durée de conservation"],
      rows: [
        ["metilde_consent", "Enregistre vos choix en matière de cookies", "12 mois"],
        ["sb-access-token", "Vous garde connecté à Mon compte", "1 heure"],
      ],
    },
    {
      type: "p",
      text: "Le panier est enregistré dans le stockage local de votre navigateur (metilde_cart), et non dans un cookie. Nous n'utilisons aucun service d'analyse distinct ; les statistiques de visite sont calculées sur notre propre serveur, sans cookies.",
    },
    { type: "h3", text: "Marketing (soumis à consentement)" },
    {
      type: "table",
      head: ["Cookie", "Finalité", "Durée de conservation"],
      rows: [
        ["_fbp", "Mesure l'efficacité de nos publicités", "3 mois"],
        ["_gcl_au", "Attribue les conversions à Google Ads", "3 mois"],
        ["_uetsid, _uetvid, MUID", "Attribue les conversions à Microsoft Advertising (Bing)", "1 jour – 13 mois"],
      ],
    },
    { type: "h2", text: "Tiers" },
    {
      type: "p",
      text: "Les cookies d'analyse et de marketing sont déposés par Google, Microsoft et Meta en tant que fournisseurs indépendants. Ils traitent les données selon leurs propres politiques, et les cookies ne sont activés qu'après votre consentement. La balise publicitaire de Google utilise le mode consentement (Consent Mode) : sans votre consentement, elle ne dépose aucun cookie et envoie uniquement des signaux anonymes sur les pages vues et les achats, sans données personnelles comme votre adresse e-mail. Google s'en sert pour estimer les résultats des publicités.",
    },
    { type: "h2", text: "Gérer les cookies dans votre navigateur" },
    {
      type: "p",
      text: "Vous pouvez bloquer ou supprimer les cookies dans les paramètres de votre navigateur. Attention : si vous bloquez les cookies essentiels, le panier, la caisse et la connexion ne fonctionneront pas.",
    },
    { type: "p", text: `Des questions sur les cookies ? Écrivez à {epost}.` },
  ],
};

/* ---------------------------- Qualité ---------------------------- */

const quality: LegalDoc = {
  slug: "kvalitetsgaranti",
  title: "Qualité et étiquetage",
  updated,
  intro: "Voici comment nos gélules sont étiquetées, et ce qui s'applique si vous n'êtes pas satisfait.",
  metaTitle: "Qualité et étiquetage – contenu, étiquette et retours",
  metaDescription:
    "Les gélules Metilde indiquent la concentration de l'extrait, la dose et le numéro de lot sur l'étiquette, et peuvent être retournées non ouvertes sous 30 jours.",
  blocks: [
    { type: "h2", text: "Ce qui s'applique à toutes nos gélules" },
    {
      type: "ul",
      items: [
        "Gélule végane sans agents de charge.",
        "La concentration de l'extrait, la quantité par gélule et le nom latin figurent sur le pot.",
        "Les gélules sont livrées dans un pot en plastique. Les matières premières proviennent des pays d'origine des plantes.",
        "Numéro de lot et date de durabilité minimale sur chaque pot.",
      ],
    },
    { type: "h2", text: "Traçabilité" },
    {
      type: "p",
      text: "Chaque pot porte un numéro de lot et une date de durabilité minimale (à consommer de préférence avant). Indiquez le numéro de lot si vous nous contactez au sujet d'un produit : nous pourrons ainsi retrouver la production dont il est issu.",
    },
    { type: "h2", text: "Si vous n'êtes pas satisfait" },
    {
      type: "p",
      text: "Les produits non ouverts peuvent être retournés sous 30 jours selon nos conditions de retour et d'échange. Si un produit est défectueux ou endommagé, le droit de réclamation s'applique, même si l'emballage a été ouvert. Contactez-nous si quelque chose ne vous semble pas normal, et nous examinerons la situation ensemble.",
    },
    { type: "h2", text: "Réglementation" },
    {
      type: "p",
      text: "Nos produits sont des compléments alimentaires et sont étiquetés conformément aux règles de l'UE relatives aux compléments alimentaires. Les compléments alimentaires ne remplacent pas une alimentation variée et un mode de vie sain et ne sont pas destinés à diagnostiquer, traiter ou guérir une maladie. Demandez conseil à un médecin si vous êtes enceinte, allaitez ou prenez des médicaments.",
    },
    ...helpBlock,
  ],
};

/* ---------------------------- Livraison ---------------------------- */

const shipping: LegalDoc = {
  slug: "frakt-och-leverans",
  title: "Expédition & livraison",
  updated,
  intro:
    "Les commandes reçues les jours ouvrés avant 12 h (CET) sont préparées et expédiées le jour même depuis notre entrepôt. Livraison offerte dès 79 € d'achat.",
  metaTitle: "Expédition & livraison – frais de port, délais et suivi",
  metaDescription:
    "Frais de port et délais de livraison de Metilde vers la France, la Belgique et le Luxembourg, livraison offerte dès 79 €, suivi, colis non retirés et ce qui s'applique en cas de livraison endommagée.",
  blocks: [
    { type: "h2", text: "Délai de préparation" },
    {
      type: "p",
      text: "Nous préparons les commandes les jours ouvrés. Les commandes reçues avant 12 h (CET) sont expédiées le jour même, les commandes plus tardives le jour ouvré suivant. Pendant les promotions et autour des jours fériés, la préparation peut prendre un jour de plus.",
    },
    { type: "h2", text: "Frais de port et délais de livraison" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Tous les prix s'entendent TVA comprise. Nous livrons notamment en France, en Belgique et au Luxembourg. Les commandes à destination de ces pays partent de notre entrepôt avec PostNord en lettre suivie ; le délai de livraison est normalement de 3 à 6 jours ouvrés. Les frais de port s'élèvent à 8,00 €, et la livraison est offerte pour toute commande supérieure à 79 €. Les abonnements et les packs sont toujours livrés gratuitement. L'envoi restant au sein de l'UE, vous ne payez aucun droit de douane ni frais d'importation.",
    },
    { type: "h2", text: "Suivre votre commande" },
    {
      type: "p",
      text: "Vous recevez une confirmation de commande dès que votre commande est passée, puis un lien de suivi dès que l'envoi quitte notre entrepôt. Vous pouvez aussi suivre la livraison via Suivre ma commande.",
    },
    { type: "h2", text: "Colis non retirés" },
    {
      type: "p",
      text: "Les colis restent disponibles 14 jours au point de retrait. Les colis non retirés nous sont retournés et nous facturons alors les frais réels d'expédition aller et retour. Prévenez-nous plutôt si vous ne pouvez pas retirer votre colis à temps – nous vous aiderons volontiers.",
    },
    { type: "h2", text: "Livraisons endommagées ou manquantes" },
    {
      type: "ul",
      items: [
        "Signalez tout dommage de transport visible dans les 7 jours suivant la réception, avec des photos de l'envoi et des produits.",
        "Le suivi indique que l'envoi a été livré mais vous n'avez rien reçu ? Renseignez-vous d'abord auprès de vos voisins et du point de retrait, puis contactez-nous dans les 14 jours.",
        "Nous envoyons une livraison de remplacement ou remboursons la commande dès que le dossier est confirmé.",
      ],
    },
    ...helpBlock,
  ],
};

/* ----------------------------- Retours & échanges ---------------------------- */

const returns: LegalDoc = {
  slug: "returer-och-byten",
  title: "Retours & échanges",
  updated,
  intro:
    "Vous disposez toujours de 30 jours pour vous rétracter – plus que les 14 jours prévus par la loi. Les produits non ouverts et dans leur état d'origine peuvent être retournés ou échangés.",
  metaTitle: "Retours & échanges – 30 jours pour changer d'avis",
  metaDescription:
    "Comment retourner ou échanger un produit chez Metilde : 30 jours de droit de rétractation, frais de retour, remboursement sous 14 jours et trois ans de droit de réclamation.",
  blocks: [
    { type: "h2", text: "Votre droit de rétractation" },
    {
      type: "p",
      text: "En tant que consommateur dans l'UE, vous disposez d'un droit légal de rétractation de 14 jours à compter du jour où vous recevez votre commande. Nous le prolongeons à 30 jours. Le droit de rétractation s'applique aux produits non ouverts et dans un état pour l'essentiel inchangé – pour des raisons d'hygiène et de sécurité alimentaire, nous ne pouvons pas revendre des compléments alimentaires ouverts.",
    },
    { type: "h2", text: "Comment effectuer un retour" },
    {
      type: "ul",
      items: [
        `Signalez votre retour en écrivant à {epost} avec votre numéro de commande et les produits concernés. Vous pouvez aussi utiliser le formulaire type de rétractation de l'UE.`,
        `Vous recevez sous un jour ouvré une étiquette de retour avec l'adresse de retour et les instructions.`,
        "Emballez les produits dans leur emballage d'origine ou dans un emballage protecteur équivalent.",
        "Déposez l'envoi et conservez la preuve d'expédition jusqu'à ce que le remboursement soit effectué.",
      ],
    },
    { type: "h2", text: "Frais de retour et remboursement" },
    {
      type: "table",
      head: ["Situation", "Frais de retour", "Remboursement"],
      rows: [
        ["Rétractation (changement d'avis)", "À votre charge, 8,00 € sont déduits du remboursement", "Le montant de la commande, frais de livraison standard d'origine compris"],
        ["Mauvais produit envoyé", "Gratuit, avec une étiquette prépayée fournie par nous", "Le montant total ou un produit de remplacement"],
        ["Produit endommagé ou défectueux", "Gratuit, avec une étiquette prépayée fournie par nous", "Le montant total ou un produit de remplacement"],
        ["Échange contre un autre produit", "À votre charge comme pour un retour (8,00 €), sauf si le produit était défectueux", "La différence est facturée ou remboursée"],
      ],
    },
    {
      type: "p",
      text: "Le remboursement est effectué avec le même moyen de paiement que lors de l'achat, dans les 14 jours suivant la réception et l'acceptation du retour, généralement sous 2 à 5 jours bancaires. Nous ne facturons aucuns frais de retour supplémentaires en plus des frais indiqués dans le tableau ci-dessus.",
    },
    { type: "h2", text: "Réclamations" },
    {
      type: "p",
      text: "Pour les produits défectueux, vous bénéficiez du droit de réclamation prévu par le droit de la consommation qui vous est applicable, notamment la garantie légale de conformité. Signalez le défaut dans un délai raisonnable après l'avoir constaté – un délai de deux mois est toujours considéré comme raisonnable. Joignez des photos et le numéro de lot figurant sur l'étiquette.",
    },
    { type: "h2", text: "Exceptions" },
    {
      type: "ul",
      items: [
        "Compléments alimentaires ouverts ou produits dont le scellé a été rompu, pour des raisons d'hygiène et de sécurité alimentaire.",
        "Produits dont la date de durabilité minimale est dépassée alors qu'ils étaient en votre possession.",
      ],
    },
    { type: "h2", text: "Règlement des litiges" },
    { type: "p", text: disputeText },
    ...helpBlock,
  ],
};

/* -------------------------------- Durabilité ------------------------------ */

const sustainability: LegalDoc = {
  slug: "hallbarhet",
  title: "Durabilité",
  updated,
  intro:
    "Moins de produits mais de meilleurs, des emballages recyclables et une chaîne d'approvisionnement que nous pouvons expliquer. Voici où nous en sommes aujourd'hui – et ce sur quoi nous continuons de travailler.",
  metaTitle: "Durabilité – emballages, expédition et matières premières",
  metaDescription:
    "Comment Metilde travaille sur la durabilité : emballages recyclables, expédition groupée depuis un seul entrepôt et matières premières documentées.",
  blocks: [
    { type: "h2", text: "Notre approche" },
    {
      type: "p",
      text: "L'empreinte la plus importante d'une marque de compléments alimentaires se situe dans les matières premières, les emballages et les transports. Nous travaillons sur ces trois points, dans cet ordre, et nous préférons dire honnêtement où nous en sommes plutôt que d'avancer des affirmations que nous ne pouvons pas documenter.",
    },
    { type: "h2", text: "Emballages" },
    {
      type: "ul",
      items: [
        "Le carton extérieur et le matériau de calage sont en papier recyclé et se trient avec les papiers.",
        "Les gélules sont livrées dans des pots en plastique à couvercle vissé qui les protègent de l'humidité et de la lumière. Le pot se trie avec les emballages en plastique.",
        "Pas de film plastique autour de l'emballage extérieur ni d'encarts papier imprimés que vous n'avez pas demandés.",
      ],
    },
    { type: "h2", text: "Expédition" },
    {
      type: "p",
      text: "Nous expédions depuis un seul entrepôt, de préférence en lettre et vers des points de retrait, car des tournées groupées signifient moins de kilomètres par envoi. Les abonnements peuvent être regroupés en une seule livraison afin que plusieurs produits voyagent ensemble.",
    },
    { type: "h2", text: "Matières premières et responsabilité sociale" },
    {
      type: "ul",
      items: [
        "Les fournisseurs doivent documenter l'origine et respecter la législation applicable en matière de travail et d'environnement.",
        "Nous achetons nos matières premières auprès de cultivateurs dont les pratiques de récolte sont documentées.",
        "Les matières premières botaniques qui ne poussent qu'en dehors de l'Europe sont achetées en lots aussi importants que possible afin de réduire le nombre de transports.",
      ],
    },
    { type: "h2", text: "Ce que nous n'avons pas encore résolu" },
    {
      type: "ul",
      items: [
        "Nous ne publions pas encore de bilan climatique complet par produit.",
        "Certaines matières premières botaniques ne peuvent être cultivées qu'en dehors de l'Europe, ce qui implique de longs transports.",
      ],
    },
    {
      type: "p",
      text: `Une question ou une suggestion sur notre démarche de durabilité ? Écrivez à {epost} – nous lisons tout.`,
    },
  ],
};

export const legalDocs: Record<string, LegalDoc> = {
  integritetspolicy: privacy,
  kopvillkor: terms,
  cookies,
  kvalitetsgaranti: quality,
  "frakt-och-leverans": shipping,
  "returer-och-byten": returns,
  hallbarhet: sustainability,
};
