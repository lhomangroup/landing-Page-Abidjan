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
      // Appeler la fonction Edge de Supabase
      const { data: result, error } = await supabase.functions.invoke('send-checklist', {
        body: data
      })

      if (error) {
        throw new Error(error.message || 'Erreur lors de l\'envoi')
      }

      return result
    } catch (error) {
      console.error('Erreur service checklist:', error)
      throw error
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