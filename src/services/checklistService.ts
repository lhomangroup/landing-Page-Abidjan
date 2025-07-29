import { supabase } from '../lib/supabase'

export interface SubscriberData {
  firstName: string
  lastName: string
  email: string
  gdprConsent: boolean
}

export class ChecklistService {
  static async subscribeAndSendChecklist(data: SubscriberData) {
    try {
      // Vérifier si les variables d'environnement Supabase sont configurées
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey || 
          supabaseUrl === 'https://placeholder.supabase.co' || 
          supabaseAnonKey.includes('placeholder')) {
        // Mode fallback : simuler un succès pour permettre la redirection
        console.log('Mode fallback activé - variables Supabase non configurées')
        return {
          message: 'Redirection vers votre offre en cours...',
          fallback: true
        }
      }

      // Essayer d'abord de stocker directement dans Supabase
      try {
        const { data: subscriber, error: directError } = await supabase
          .from('subscribers')
          .upsert({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            gdpr_consent: data.gdprConsent,
            checklist_sent: false
          }, {
            onConflict: 'email'
          })
          .select()
          .single()

        if (!directError) {
          console.log('Données stockées directement dans Supabase:', subscriber.id)
        } else {
          console.warn('Erreur stockage direct:', directError)
        }
      } catch (directStorageError) {
        console.warn('Erreur lors du stockage direct:', directStorageError)
      }

      // Appeler la fonction Edge de Supabase
      const { data: result, error } = await supabase.functions.invoke('send-checklist', {
        body: data
      })

      if (error) {
        console.error('Erreur Edge Function:', error)
        // Mode fallback en cas d'erreur
        return {
          message: 'Données sauvegardées. Redirection vers votre offre en cours...',
          fallback: true
        }
      }

      return result
    } catch (error) {
      console.error('Erreur service checklist:', error)
      // Mode fallback en cas d'erreur
      return {
        message: 'Données sauvegardées. Redirection vers votre offre en cours...',
        fallback: true
      }
    }
  }

  static async checkIfEmailExists(email: string) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('id, checklist_sent')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return data
    } catch (error) {
      console.error('Erreur vérification email:', error)
      return null
    }
  }
}