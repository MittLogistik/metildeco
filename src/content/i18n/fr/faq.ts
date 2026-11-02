/** Questions fréquentes (fr-FR). Svaren följer köpvillkor, fraktsida och retursida för Frankrike, Belgien och Luxemburg. */
import type { FaqGroup } from "@/content/faq";
import { company } from "@/lib/site";

export const faqGroups: FaqGroup[] = [
  {
    id: "bestallning",
    title: "Commande & paiement",
    items: [
      {
        q: "Quels moyens de paiement puis-je utiliser ?",
        a: "Vous pouvez payer avec Klarna, Visa, Mastercard, American Express, Apple Pay et Google Pay. Le paiement est traité par Stripe – nous ne conservons jamais les données de votre carte.",
      },
      {
        q: "Puis-je modifier ou annuler ma commande ?",
        a: `Écrivez-nous dès que possible à ${company.email} en indiquant votre numéro de commande. Si la commande n'a pas encore été préparée, nous la modifions ou l'annulons. Si elle a déjà été expédiée, vous pouvez exercer votre droit de rétractation à réception du colis.`,
      },
      {
        q: "Vais-je recevoir un reçu ?",
        a: "Oui, la confirmation de commande avec le reçu est envoyée à votre adresse e-mail dès que le paiement est effectué.",
      },
      {
        q: "Puis-je commander en tant qu'entreprise ?",
        a: `Oui. Indiquez le nom de l'entreprise et son numéro d'immatriculation dans le champ adresse, ou écrivez à ${company.email} si vous souhaitez une facture.`,
      },
    ],
  },
  {
    id: "frakt",
    title: "Livraison",
    items: [
      {
        q: "Combien coûte la livraison ?",
        a: "La livraison vers la France, la Belgique et le Luxembourg coûte 8,00 €, et elle est offerte pour toute commande de plus de 79 €. Les abonnements et les packs sont toujours livrés gratuitement. Les tarifs en vigueur figurent sur la page Livraison.",
      },
      {
        q: "Quel est le délai de livraison ?",
        a: "Les commandes passées en semaine avant 12 h (heure suédoise) sont expédiées le jour même depuis notre entrepôt en Suède. Le délai de livraison vers la France, la Belgique et le Luxembourg est normalement de 3 à 6 jours ouvrés.",
      },
      {
        q: "Livrez-vous en France, en Belgique et au Luxembourg ?",
        a: "Oui. Les commandes vers la France, la Belgique et le Luxembourg sont envoyées par PostNord en lettre suivie depuis notre entrepôt en Suède. Comme l'envoi reste au sein de l'UE, vous ne payez ni frais de douane ni taxes d'importation.",
      },
      {
        q: "Comment suivre mon colis ?",
        a: "Vous recevez un lien de suivi par e-mail dès que le colis quitte l'entrepôt. Vous pouvez aussi saisir votre numéro de commande et votre e-mail sous Suivre ma commande.",
      },
    ],
  },
  {
    id: "retur",
    title: "Retours & réclamations",
    items: [
      {
        q: "Quel droit de rétractation s'applique ?",
        a: "30 jours à compter de la réception de votre commande – plus que les 14 jours prévus par la loi. Le produit doit être non ouvert, car pour des raisons d'hygiène et de sécurité alimentaire, nous ne pouvons pas revendre des compléments alimentaires ouverts.",
      },
      {
        q: "Comment effectuer un retour ?",
        a: `Écrivez à ${company.email} en indiquant votre numéro de commande et les articles concernés. Vous recevrez une étiquette de retour et les instructions sous un jour ouvré. En cas de rétractation, les frais de retour sont à votre charge et 8,00 € sont déduits du remboursement. Nous vous remboursons dans les 14 jours suivant la réception du retour.`,
      },
      {
        q: "Que faire si un produit est endommagé ?",
        a: "Signalez le dommage dans les 7 jours avec des photos du colis et du produit. Nous vous envoyons un produit de remplacement ou vous remboursons, et nous prenons en charge les frais de retour.",
      },
    ],
  },
  {
    id: "prenumeration",
    title: "Abonnement",
    items: [
      {
        q: "Comment fonctionne l'abonnement ?",
        a: "Choisissez Abonnement sur la page produit et vous bénéficiez de 15 % de remise et de la livraison offerte sur chaque livraison. Vous choisissez la fréquence (30, 60 ou 90 jours) et pouvez mettre en pause ou résilier quand vous le souhaitez.",
      },
      {
        q: "Quand le paiement est-il prélevé ?",
        a: "La première livraison est payée lors de l'achat. Ensuite, le paiement est prélevé automatiquement au début de chaque nouvelle période, tous les 30, 60 ou 90 jours à compter de l'achat. Le colis est expédié quelques jours après le prélèvement et vous recevez un e-mail avec la date de livraison estimée.",
      },
      {
        q: "Comment mettre en pause ou résilier mon abonnement ?",
        a: "Écrivez à notre service client : nous mettons en pause ou résilions l’abonnement pour vous et vous le confirmons par écrit. Une pause s'applique immédiatement et aucun prélèvement n'est effectué tant que vous n'avez pas repris l'abonnement. Si vous résiliez, aucun nouveau prélèvement n'est effectué et l'abonnement prend fin à l'issue de la période payée. Sans engagement et sans frais.",
      },
      {
        q: "Puis-je changer de produit ou de fréquence ?",
        a: "Oui. Écrivez à notre service client et nous modifions la fréquence, la quantité, le produit ou l'adresse de livraison avant la prochaine livraison.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Produits & qualité",
    items: [
      {
        q: "D'où viennent vos produits ?",
        a: "Metilde est une marque suédoise et la gamme est développée en Suède. Les matières premières et les extraits proviennent des pays d'origine des plantes, par exemple la maca des Andes.",
      },
      {
        q: "Comment savoir quel lot j'ai reçu ?",
        a: "Le numéro de lot et la date de durabilité minimale figurent sur le pot. Indiquez le numéro de lot si vous nous contactez au sujet d'un produit, afin que nous puissions le retracer.",
      },
      {
        q: "Les produits contiennent-ils des additifs superflus ?",
        a: "Non. Nos gélules contiennent l'extrait et une enveloppe de gélule d'origine végétale – pas de liants, d'agents de charge, de colorants ni d'édulcorants.",
      },
      {
        q: "Comment conserver les produits ?",
        a: "Au sec et à température ambiante, avec le couvercle bien revissé après chaque utilisation et hors de portée des jeunes enfants.",
      },
    ],
  },
  {
    id: "konto",
    title: "Compte & confidentialité",
    items: [
      {
        q: "Dois-je créer un compte pour commander ?",
        a: "Non, vous pouvez commander en tant qu'invité. Un compte n'est nécessaire que pour gérer vos abonnements et consulter l'historique de vos commandes.",
      },
      {
        q: "Comment traitez-vous mes données personnelles ?",
        a: "Nous utilisons vos données pour traiter votre commande et gérer votre compte. Si vous avez accepté les cookies marketing, nous partageons également certaines informations avec Meta et Google afin de mesurer nos publicités. Nous ne vendons jamais vos données. Pour en savoir plus, consultez notre politique de confidentialité.",
      },
    ],
  },
];
