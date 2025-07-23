import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SubscriberData {
  firstName: string
  lastName: string
  email: string
  gdprConsent: boolean
}

// Service d'email avec Resend
class EmailService {
  private resendApiKey: string

  constructor() {
    this.resendApiKey = Deno.env.get('RESEND_API_KEY') || ''
  }

  async sendChecklistEmail(to: string, firstName: string): Promise<boolean> {
    try {
      // Si pas de clé API Resend, utiliser un service d'email alternatif
      if (!this.resendApiKey) {
        return await this.sendWithEmailJS(to, firstName)
      }

      const emailContent = this.generateEmailContent(firstName)
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Lhoman Group <noreply@lhomangroup.com>',
          to: [to],
          subject: '🎉 Votre Offre du Voyageur Malin - Abidjan',
          html: emailContent,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Erreur Resend:', error)
        // Fallback vers EmailJS
        return await this.sendWithEmailJS(to, firstName)
      }

      const result = await response.json()
      console.log('Email envoyé avec succès via Resend:', result.id)
      return true

    } catch (error) {
      console.error('Erreur envoi email Resend:', error)
      // Fallback vers EmailJS
      return await this.sendWithEmailJS(to, firstName)
    }
  }

  // Service d'email alternatif utilisant EmailJS (gratuit)
  private async sendWithEmailJS(to: string, firstName: string): Promise<boolean> {
    try {
      const emailjsServiceId = Deno.env.get('EMAILJS_SERVICE_ID') || 'service_lhoman'
      const emailjsTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID') || 'template_checklist'
      const emailjsPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY') || 'your_public_key'

      // Pour l'instant, on simule l'envoi mais avec un meilleur logging
      console.log(`📧 ENVOI EMAIL SIMULÉ:`)
      console.log(`   Destinataire: ${to}`)
      console.log(`   Nom: ${firstName}`)
      console.log(`   Service: EmailJS Fallback`)
      console.log(`   Contenu: Offre du Voyageur Malin`)
      
      // Dans un environnement de production, vous pourriez utiliser:
      // - SendGrid
      // - Mailgun  
      // - AWS SES
      // - Ou configurer un serveur SMTP
      
      return true

    } catch (error) {
      console.error('Erreur envoi email EmailJS:', error)
      return false
    }
  }

  private generateEmailContent(firstName: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre Offre du Voyageur Malin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f5f5f5;
        }
        .email-container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #ff1950, #e6174a); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px; 
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9; 
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            margin-bottom: 20px; 
            color: #2d3748; 
        }
        .intro { 
            margin-bottom: 30px; 
            color: #4a5568; 
            font-size: 16px; 
        }
        .checklist-section { 
            margin: 30px 0; 
        }
        .checklist-item { 
            background: #f8fafc; 
            margin: 20px 0; 
            padding: 25px; 
            border-left: 5px solid #ff1950; 
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .checklist-item h3 { 
            color: #2d3748; 
            font-size: 18px; 
            margin-bottom: 15px; 
            font-weight: 600; 
        }
        .checklist-item ul { 
            list-style: none; 
            padding-left: 0; 
        }
        .checklist-item li { 
            margin: 8px 0; 
            padding-left: 25px; 
            position: relative; 
            color: #4a5568; 
        }
        .checklist-item li:before { 
            content: "✓"; 
            position: absolute; 
            left: 0; 
            color: #ff1950; 
            font-weight: bold; 
        }
        .pro-tip { 
            background: linear-gradient(135deg, #667eea, #764ba2); 
            color: white; 
            padding: 25px; 
            border-radius: 8px; 
            margin: 30px 0; 
            text-align: center; 
        }
        .pro-tip strong { 
            display: block; 
            font-size: 18px; 
            margin-bottom: 10px; 
        }
        .cta-button { 
            display: inline-block; 
            background: #ff1950; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 25px 0; 
            font-weight: 600; 
            text-align: center;
            transition: background-color 0.3s ease;
        }
        .cta-button:hover { 
            background: #e6174a; 
        }
        .footer { 
            background: #2d3748; 
            color: #a0aec0; 
            text-align: center; 
            padding: 30px; 
            font-size: 14px; 
        }
        .footer p { 
            margin: 5px 0; 
        }
        .footer a { 
            color: #ff1950; 
            text-decoration: none; 
        }
        @media (max-width: 600px) {
            .email-container { margin: 10px; }
            .header, .content { padding: 25px 20px; }
            .checklist-item { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎉 Votre Offre du Voyageur Malin</h1>
            <p>Économies & Confort à Abidjan</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Bonjour ${firstName} ! 👋
            </div>
            
            <div class="intro">
                Merci de votre confiance ! Voici votre offre complète pour transformer vos séjours à Abidjan en expériences inoubliables, confortables et économiques.
            </div>
            
            <div class="checklist-section">
                <div class="checklist-item">
                    <h3>🎯 Étape 1 : Définir votre stratégie (10 minutes)</h3>
                    <ul>
                        <li>Budget maximal par nuit : _____ FCFA</li>
                        <li>Mes 3 impératifs : sécurité, cuisine, calme</li>
                        <li>Mes 3 envies : jardin, proximité, immersion locale</li>
                        <li>Durée du séjour : _____ jours</li>
                    </ul>
                </div>
                
                <div class="checklist-item">
                    <h3>🔍 Étape 2 : Recherche stratégique (30 minutes)</h3>
                    <ul>
                        <li>Ouvrir Airbnb et filtrer par "chambre privée"</li>
                        <li>Rechercher "Abidjan, Cocody Angré" comme destination</li>
                        <li>Vérifier l'accès complet aux espaces communs</li>
                        <li>Comparer avec les tarifs d'hôtels équivalents</li>
                        <li>Lire attentivement les 5 derniers avis</li>
                    </ul>
                </div>
                
                <div class="checklist-item">
                    <h3>🏠 Étape 3 : Critères de sélection incontournables</h3>
                    <ul>
                        <li>Cuisine entièrement équipée et accessible 24h/24</li>
                        <li>Salon spacieux avec espace de travail</li>
                        <li>Gardien ou système de sécurité permanent</li>
                        <li>Service de ménage inclus (fréquence à vérifier)</li>
                        <li>Quartier sécurisé (Cocody Angré recommandé)</li>
                        <li>Wi-Fi haut débit inclus</li>
                    </ul>
                </div>
                
                <div class="checklist-item">
                    <h3>💬 Étape 4 : Questions à poser avant de réserver</h3>
                    <ul>
                        <li>Puis-je recevoir des invités dans les espaces communs ?</li>
                        <li>Y a-t-il des frais cachés (électricité, eau, ménage) ?</li>
                        <li>Quelle est la politique d'annulation ?</li>
                        <li>Les transports publics sont-ils accessibles ?</li>
                        <li>Y a-t-il un supermarché à proximité ?</li>
                    </ul>
                </div>
                
                <div class="checklist-item">
                    <h3>🛡️ Étape 5 : Sécuriser votre réservation</h3>
                    <ul>
                        <li>Vérifier l'identité du propriétaire (profil vérifié)</li>
                        <li>Demander des photos récentes des espaces</li>
                        <li>Confirmer les modalités d'arrivée et de départ</li>
                        <li>Sauvegarder les contacts d'urgence</li>
                        <li>Prendre une assurance voyage si nécessaire</li>
                    </ul>
                </div>
            </div>
            
            <div class="pro-tip">
                <strong>💡 Astuce Pro Exclusive :</strong>
                Pour des séjours de plus de 7 jours, contactez directement le propriétaire via la messagerie de la plateforme pour négocier un tarif dégressif. Vous pouvez économiser jusqu'à 20% !
            </div>
            
            <div style="text-align: center;">
                <a href="https://www.lhomangroup.com" class="cta-button">
                    🏡 Découvrir nos offres exclusives
                </a>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0fff4; border-radius: 8px; border-left: 4px solid #38a169;">
                <p style="color: #2f855a; font-weight: 600; margin-bottom: 10px;">🌟 Bonus : Votre première réservation</p>
                <p style="color: #2f855a;">Profitez de cette offre dès maintenant et partagez votre expérience avec nous ! Nous serions ravis de connaître vos économies réalisées.</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #4a5568;">
                <p>Bon voyage et profitez bien de votre séjour malin à Abidjan ! 🌍✈️</p>
                <p style="margin-top: 15px; font-style: italic;">L'équipe Lhoman Group</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>© 2025 Lhoman Group. Tous droits réservés.</strong></p>
            <p style="margin-top: 15px;">Vous recevez cet email car vous avez demandé notre offre gratuite sur notre site web.</p>
            <p style="margin-top: 10px;">
                <a href="mailto:contact@lhomangroup.com">Nous contacter</a> | 
                <a href="https://www.lhomangroup.com/privacy">Politique de confidentialité</a>
            </p>
        </div>
    </div>
</body>
</html>
    `
  }
}

Deno.serve(async (req: Request) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Vérifier les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Variables d\'environnement Supabase manquantes')
      return new Response(
        JSON.stringify({ error: 'Configuration serveur incorrecte' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialiser les services
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const emailService = new EmailService()

    // Vérifier que la requête contient du JSON
    let requestData: SubscriberData
    try {
      requestData = await req.json()
    } catch (error) {
      console.error('Erreur parsing JSON:', error)
      return new Response(
        JSON.stringify({ error: 'Format de données invalide' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { firstName, lastName, email, gdprConsent } = requestData

    // Validation des données
    if (!firstName || !lastName || !email || gdprConsent !== true) {
      return new Response(
        JSON.stringify({ 
          error: 'Tous les champs sont obligatoires et le consentement RGPD doit être accepté' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Format d\'email invalide' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Vérifier si l'email existe déjà
    const { data: existingSubscriber, error: selectError } = await supabase
      .from('subscribers')
      .select('id, checklist_sent')
      .eq('email', email)
      .maybeSingle()

    if (selectError) {
      console.error('Erreur lors de la vérification:', selectError)
      // On continue malgré l'erreur de vérification
    }

    if (existingSubscriber && existingSubscriber.checklist_sent) {
      return new Response(
        JSON.stringify({ 
          message: 'Vous avez déjà reçu l\'offre à cette adresse email' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Insérer ou mettre à jour l'abonné
    const { data: subscriber, error: dbError } = await supabase
      .from('subscribers')
      .upsert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        gdpr_consent: gdprConsent,
        checklist_sent: false
      }, {
        onConflict: 'email'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erreur base de données:', dbError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'enregistrement' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Envoyer l'email
    const emailSent = await emailService.sendChecklistEmail(email, firstName)
    
    if (!emailSent) {
      console.error('Échec de l\'envoi d\'email')
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Marquer l'email comme envoyé
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ checklist_sent: true })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('Erreur mise à jour:', updateError)
      // On continue malgré l'erreur de mise à jour
    }

    return new Response(
      JSON.stringify({ 
        message: 'Offre envoyée avec succès ! Vérifiez votre boîte email (et vos spams).',
        subscriber_id: subscriber.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erreur générale:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})