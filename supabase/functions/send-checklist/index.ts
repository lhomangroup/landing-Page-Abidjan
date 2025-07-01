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

Deno.serve(async (req: Request) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialiser le client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Récupérer les données du formulaire
    const { firstName, lastName, email, gdprConsent }: SubscriberData = await req.json()

    // Validation des données
    if (!firstName || !lastName || !email || !gdprConsent) {
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
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('id, checklist_sent')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.checklist_sent) {
        return new Response(
          JSON.stringify({ 
            message: 'Vous avez déjà reçu la checklist à cette adresse email' 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
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

    // Préparer le contenu de l'email
    const emailContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre Checklist du Voyageur Malin</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff1950, #e6174a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .checklist-item { background: white; margin: 15px 0; padding: 15px; border-left: 4px solid #ff1950; border-radius: 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #ff1950; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Votre Checklist du Voyageur Malin</h1>
            <p>Économies & Confort à Abidjan</p>
        </div>
        
        <div class="content">
            <h2>Bonjour ${firstName} !</h2>
            
            <p>Merci de votre intérêt pour notre checklist ! Voici votre guide complet pour un séjour malin à Abidjan :</p>
            
            <div class="checklist-item">
                <h3>✅ Étape 1 : Définir votre budget et vos priorités</h3>
                <ul>
                    <li>Budget maximal par nuit : _____ FCFA</li>
                    <li>3 impératifs : sécurité, cuisine, calme</li>
                    <li>3 envies : jardin, proximité, immersion</li>
                </ul>
            </div>
            
            <div class="checklist-item">
                <h3>🔍 Étape 2 : Recherche stratégique</h3>
                <ul>
                    <li>Filtrer par "chambre privée" sur Airbnb</li>
                    <li>Chercher "Abidjan, Cocody Angré"</li>
                    <li>Vérifier l'accès aux espaces communs</li>
                    <li>Comparer avec les prix d'hôtels</li>
                </ul>
            </div>
            
            <div class="checklist-item">
                <h3>🏠 Étape 3 : Critères de sélection</h3>
                <ul>
                    <li>Cuisine entièrement équipée accessible</li>
                    <li>Salon spacieux et espaces de détente</li>
                    <li>Gardien ou système de sécurité 24h/24</li>
                    <li>Service de ménage régulier inclus</li>
                    <li>Quartier sécurisé (ex: Cocody Angré)</li>
                </ul>
            </div>
            
            <div class="checklist-item">
                <h3>💡 Bonus : Questions à poser avant de réserver</h3>
                <ul>
                    <li>Puis-je recevoir des invités ?</li>
                    <li>Y a-t-il des frais cachés ?</li>
                    <li>Le Wi-Fi est-il inclus et performant ?</li>
                    <li>Quels sont les moyens de transport à proximité ?</li>
                </ul>
            </div>
            
            <p><strong>Astuce Pro :</strong> Contactez directement le propriétaire pour négocier les tarifs pour des séjours de plus de 7 jours !</p>
            
            <a href="https://www.lhomangroup.com" class="button">Découvrir nos offres exclusives</a>
            
            <p>Bon voyage et profitez bien de votre séjour malin à Abidjan ! 🌍</p>
        </div>
        
        <div class="footer">
            <p>© 2025 Lhoman Group. Tous droits réservés.</p>
            <p>Vous recevez cet email car vous avez demandé notre checklist gratuite.</p>
        </div>
    </div>
</body>
</html>
    `

    // Envoyer l'email (simulation - dans un vrai projet, vous utiliseriez un service comme SendGrid, Resend, etc.)
    // Pour cette démo, nous marquons simplement l'email comme envoyé
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ checklist_sent: true })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('Erreur mise à jour:', updateError)
    }

    // Dans un environnement de production, vous intégreriez ici un service d'email
    // comme SendGrid, Resend, ou AWS SES pour envoyer réellement l'email
    
    return new Response(
      JSON.stringify({ 
        message: 'Checklist envoyée avec succès ! Vérifiez votre boîte email.',
        subscriber_id: subscriber.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})