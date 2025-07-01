/*
  # Création de la table des abonnés pour la checklist

  1. Nouvelle table
    - `subscribers`
      - `id` (uuid, clé primaire)
      - `first_name` (text, prénom)
      - `last_name` (text, nom)
      - `email` (text, unique, email)
      - `gdpr_consent` (boolean, consentement RGPD)
      - `checklist_sent` (boolean, checklist envoyée)
      - `created_at` (timestamp, date de création)
      - `updated_at` (timestamp, date de mise à jour)

  2. Sécurité
    - Activer RLS sur la table `subscribers`
    - Ajouter une politique pour permettre l'insertion publique
    - Ajouter une politique pour la lecture par les utilisateurs authentifiés
*/

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  gdpr_consent boolean NOT NULL DEFAULT false,
  checklist_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (pour le formulaire)
CREATE POLICY "Allow public insert"
  ON subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique pour la lecture par les utilisateurs authentifiés
CREATE POLICY "Allow authenticated read"
  ON subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at);